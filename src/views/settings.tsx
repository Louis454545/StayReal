import { JSXElement, type Component } from "solid-js";
import auth from "../stores/auth";
import { useNavigate } from "@solidjs/router";
import MdiChevronLeft from '~icons/mdi/chevron-left'
import MdiLogout from '~icons/mdi/logout'
import MdiGithub from '~icons/mdi/github'
import MdiDelete from '~icons/mdi/delete'
import { open } from "@tauri-apps/plugin-shell";
import { deletePersonMe, ProfileDeletionAlreadyScheduledError } from "~/api/requests/person/me";
import { confirm, message } from '@tauri-apps/plugin-dialog';
import { createSignal } from 'solid-js';

const Settings: Component = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = createSignal(localStorage.getItem('theme') || 'dark');

  const handleThemeChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const selectedTheme = target.value;
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
    document.body.setAttribute('data-theme', selectedTheme);
  };

  const Entry: Component<{ title: string, icon: JSXElement, onClick: () => void }> = (props) => (
    <button
      type="button"
      onClick={props.onClick}
      class="flex items-center justify-between w-full px-4 py-2 bg-white/10 rounded-lg"
    >
      <div class="flex items-center gap-4">
        {props.icon}
        <p>{props.title}</p>
      </div>
    </button>
  );

  return (
    <>
      <header class="pt-[env(safe-area-inset-top)]">
        <nav class="flex items-center justify-between px-4 h-[72px]">
          <a href="/profile" class="p-2.5 rounded-full ml-[-10px]" aria-label="Back to profile">
            <MdiChevronLeft class="text-2xl" />
          </a>
        </nav>
      </header>

      <div class="p-4">
        <div class="flex flex-col gap-2">
          <Entry title="Logout" icon={<MdiLogout />} onClick={async () => {
            await auth.logout();
            navigate("/");
          }} />
          <Entry title="Report an issue on GitHub" icon={<MdiGithub />} onClick={() => {
            open("https://github.com/Vexcited/StayReal/issues");
          }} />
          <Entry title="Request account deletion" icon={<MdiDelete />} onClick={async () => {
            const confirmation = await confirm("You will be logged out immediately and your account and all your data will be scheduled to be permanently deleted in 15 days.\n\nIf you log in within those 15 days, your account will no longer be deleted.", {
              title: "So, you want to delete your account?",
              kind: 'warning',
              cancelLabel: "I changed my mind",
              okLabel: "Yes, I'm sure"
            });

            if (!confirmation) return;

            try {
              const deletion = await deletePersonMe();
              await message(`Your account has been scheduled for deletion: ${new Date(deletion.accountDeleteScheduledAt).toLocaleString()}`);
            }
            catch (error) {
              if (error instanceof ProfileDeletionAlreadyScheduledError) {
                await message("Your account is already scheduled for deletion", { kind: 'warning' });
                navigate("/");
              }
              else {
                await message("Failed to delete your account, please try again later", { kind: 'error' });
                return;
              }
            }

            await auth.logout();
            navigate("/");
          }} />
        </div>
      </div>

      <div class="p-4">
        <h1>Paramètres</h1>
        <label htmlFor="theme-select">Choisir le thème:</label>
        <select id="theme-select" value={theme()} onChange={handleThemeChange}>
          <option value="dark">Sombre</option>
          <option value="light">Clair</option>
        </select>
      </div>
    </>
  )
};

export default Settings;
