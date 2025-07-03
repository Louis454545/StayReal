import { fetch } from "@tauri-apps/plugin-http";
import { writeFile, createDir, exists } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import { getFeedsFriends, type Post, type PostsOverview } from "~/api/requests/feeds/friends";
import autoSaveStore from "~/stores/auto-save";

interface SavedPost {
  id: string;
  savedAt: string;
}

class AutoSaveService {
  private savedPosts: Set<string> = new Set();
  private intervalId: number | null = null;

  constructor() {
    this.loadSavedPosts();
  }

  private loadSavedPosts() {
    try {
      const saved = localStorage.getItem('auto_save_saved_posts');
      if (saved) {
        const posts: SavedPost[] = JSON.parse(saved);
        this.savedPosts = new Set(posts.map(p => p.id));
      }
    } catch (error) {
      console.error('Error loading saved posts:', error);
    }
  }

  private saveSavedPosts() {
    try {
      const posts: SavedPost[] = Array.from(this.savedPosts).map(id => ({
        id,
        savedAt: new Date().toISOString()
      }));
      localStorage.setItem('auto_save_saved_posts', JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving saved posts:', error);
    }
  }

  private async downloadImage(url: string, filePath: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status}`);
      }

      const imageData = await response.arrayBuffer();
      await writeFile(filePath, new Uint8Array(imageData));
    } catch (error) {
      console.error(`Error downloading image from ${url}:`, error);
      throw error;
    }
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      if (!(await exists(dirPath))) {
        await createDir(dirPath, { recursive: true });
      }
    } catch (error) {
      console.error(`Error creating directory ${dirPath}:`, error);
      throw error;
    }
  }

  private getFileExtension(url: string, mimeType?: string): string {
    // Try to get extension from MIME type first
    if (mimeType) {
      if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return '.jpg';
      if (mimeType.includes('png')) return '.png';
      if (mimeType.includes('webp')) return '.webp';
      if (mimeType.includes('mp4')) return '.mp4';
    }

    // Fallback to URL extension
    const urlParts = url.split('.');
    const extension = urlParts[urlParts.length - 1]?.split('?')[0];
    return extension ? `.${extension}` : '.jpg';
  }

  private async savePost(post: Post, username: string, basePath: string): Promise<void> {
    try {
      // Create user directory
      const userDir = await join(basePath, `@${username}`);
      await this.ensureDirectoryExists(userDir);

      // Create date directory (YYYY-MM-DD format)
      const postDate = new Date(post.postedAt);
      const dateStr = postDate.toISOString().split('T')[0];
      const dateDir = await join(userDir, dateStr);
      await this.ensureDirectoryExists(dateDir);

      // Create post directory with timestamp
      const timeStr = postDate.toISOString().replace(/[:.]/g, '-');
      const postDir = await join(dateDir, `${timeStr}_${post.id.slice(-8)}`);
      await this.ensureDirectoryExists(postDir);

      // Download primary image
      const primaryExt = this.getFileExtension(post.primary.url, post.primary.mimeType);
      const primaryPath = await join(postDir, `primary${primaryExt}`);
      await this.downloadImage(post.primary.url, primaryPath);

      // Download secondary image
      const secondaryExt = this.getFileExtension(post.secondary.url, post.secondary.mimeType);
      const secondaryPath = await join(postDir, `secondary${secondaryExt}`);
      await this.downloadImage(post.secondary.url, secondaryPath);

      // Download BTS video if available
      if (post.btsMedia) {
        const btsExt = this.getFileExtension(post.btsMedia.url, post.btsMedia.mimeType);
        const btsPath = await join(postDir, `bts${btsExt}`);
        await this.downloadImage(post.btsMedia.url, btsPath);
      }

      // Save metadata
      const metadata = {
        id: post.id,
        username: username,
        caption: post.caption,
        location: post.location,
        postedAt: post.postedAt,
        takenAt: post.takenAt,
        isLate: post.isLate,
        lateInSeconds: post.lateInSeconds,
        retakeCounter: post.retakeCounter,
        visibility: post.visibility,
        music: post.music,
        savedAt: new Date().toISOString()
      };

      const metadataPath = await join(postDir, 'metadata.json');
      const metadataContent = JSON.stringify(metadata, null, 2);
      await writeFile(metadataPath, new TextEncoder().encode(metadataContent));

      console.log(`Successfully saved BeReal from @${username} (${post.id})`);
    } catch (error) {
      console.error(`Error saving post ${post.id} from @${username}:`, error);
      throw error;
    }
  }

  private async checkForNewPosts(): Promise<void> {
    try {
      const settings = autoSaveStore.get();
      
      if (!settings.enabled || !settings.savePath || settings.selectedFriends.length === 0) {
        return;
      }

      console.log('Checking for new BeReals to save...');

      const feed = await getFeedsFriends();
      let savedCount = 0;

      // Check friends' posts
      if (feed.friendsPosts) {
        for (const friendPosts of feed.friendsPosts) {
          if (!settings.selectedFriends.includes(friendPosts.user.id)) {
            continue; // Skip if friend not selected
          }

          for (const post of friendPosts.posts) {
            if (!this.savedPosts.has(post.id)) {
              try {
                await this.savePost(post, friendPosts.user.username, settings.savePath);
                this.savedPosts.add(post.id);
                savedCount++;
              } catch (error) {
                console.error(`Failed to save post ${post.id}:`, error);
              }
            }
          }
        }
      }

      // Update saved posts and last check time
      this.saveSavedPosts();
      autoSaveStore.updateLastCheck();

      if (savedCount > 0) {
        console.log(`Auto-saved ${savedCount} new BeReal${savedCount > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error('Error checking for new posts:', error);
    }
  }

  public start(): void {
    if (this.intervalId) {
      return; // Already running
    }

    console.log('Starting auto-save service...');
    
    // Check immediately
    this.checkForNewPosts();
    
    // Then check every 5 minutes
    this.intervalId = window.setInterval(() => {
      this.checkForNewPosts();
    }, 5 * 60 * 1000);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Auto-save service stopped');
    }
  }

  public isRunning(): boolean {
    return this.intervalId !== null;
  }

  public async checkNow(): Promise<void> {
    await this.checkForNewPosts();
  }
}

export const autoSaveService = new AutoSaveService();

// Auto-start the service when settings are enabled
autoSaveStore.get(); // Initialize the store
const settings = autoSaveStore.get();
if (settings.enabled && settings.savePath && settings.selectedFriends.length > 0) {
  autoSaveService.start();
}