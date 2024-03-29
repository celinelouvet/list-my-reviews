<script lang="ts">
  import { Checkbox, TextInput, Title, Space, Stack } from "@svelteuidev/core";
  import { getSettings, setSettings } from "../technical";

  let settings = getSettings();
  type Name =
    | "username"
    | "organization"
    | "team"
    | "token"
    | "withRenovate"
    | "withApprovedPullRequests";

  const saveSettings = (event: CustomEvent<unknown>) => {
    const target = event.target as HTMLInputElement;

    const name = target.name as Name;

    const realType = name in settings ? typeof settings[name] : "string";
    const value = realType === "boolean" ? target.checked : target.value;

    const updatedSettings = { ...settings, [name]: value };

    setSettings(updatedSettings);
  };
</script>

<Title order={3}>Github configuration</Title>
<Space h="md" />
<Stack spacing="sm">
  <TextInput
    label="Your username"
    name="username"
    bind:value={settings.username}
    on:blur={saveSettings}
  />
  <TextInput
    label="Your organization"
    name="organization"
    bind:value={settings.organization}
    on:blur={saveSettings}
  />
  <TextInput
    label="Your team"
    name="team"
    bind:value={settings.team}
    on:blur={saveSettings}
  />
  <TextInput
    label="Personal Access Token"
    name="token"
    bind:value={settings.token}
    on:blur={saveSettings}
  />
</Stack>

<Space h="xl" />

<Title order={3}>Pull requests</Title>
<Space h="md" />
<Stack>
  <Checkbox
    bind:checked={settings.withRenovate}
    name="withRenovate"
    label="View renovate pull requests"
    on:change={saveSettings}
  />
  <Checkbox
    bind:checked={settings.withApprovedPullRequests}
    name="withApprovedPullRequests"
    label="View already approved pull requests"
    on:change={saveSettings}
  />
</Stack>
