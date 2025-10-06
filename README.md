# TCT MD 


[![GitHub](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://t.me/TheCarlTech)


## About

> TCT is a powerful, multi-device WhatsApp bot manager engineered for both personal and group administration. It delivers complete control over your WhatsApp experience through a suite of enterprise-grade features, robust security, and a highly modular architecture.

---
## Why Use TCT?
----------------

  - 🔑 **Easy Pairing** - Streamlined session generation and management.

  - ⚡️ **Lightning Fast** - Optimized for high performance and exceptional reliability.

  - 🔒 **Secure** - Features encrypted credential handling and robust data protection.

  - 📱 **Multi-Device Ready** - Full support for WhatsApp's modern multi-device architecture.

  - 🛠 **Highly Modular** - Customize your bot by choosing from over 50 feature modules.

---

## 🏃‍♂️ Quick Start  on VPS

### 1.  First, you need to get a session id  or scan on terminal later

👇 click here 
  
<a href="https://pair.thebookiebasher.win/" target="_blank">
  <img src="https://files.thebookiebasher.win/media/tctlogo2.png" alt="Get Session ID" width="32" height="32" style="border-radius:6px;">
</a>

### 2. Deploy on  vps

<details>
<summary><strong>Click to coppy the command </strong></summary>

```bash
bash <(curl -Ls https://sty.ink/wlki2)
```
</details>

---
### 3. Configure & Enjoy!
 Edit .env 
```bash


# OpenWeatherMap API key (sign up at https://openweathermap.org/api)
OPENWEATHER_API_KEY=


# ⚽ FOOTBALL-DATA.ORG API KEY
# Sign up at https://www.football-data.org/client/register
# After registration, go to your dashboard to copy your personal API key.

FOOTBALL_API_KEY=""

SESSION_ID=tct_xxx

see more examples as env.example
```

open config.yml  and edit

example config.yml  

```bash
TIMEZONE: Africa/Nairobi
```


To start the bot manually use

```bash
npm start
```
or

```bash
yarn start
```

To stop the bot

```bash
pm2 stop {bot name}
```


## Need help! Join our support group

[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/TheCarlTech)



---

# 👇 BOT FEATURES BREAKDOWN 


---
<details>
  <summary>FEATURES</summary>

---

<details>
  <summary>common</summary>

### How to use common module

> Thisnmodule lets a user list all members who are in common groups

> > Example, listing innall groups the bot is in

```bash
common list
```
> > listing specific groups only

```bash
common list

120363402766547897@g.us

120363381868174024@g.us
```


</details>
<details>
<summary>Active</summary>

### How to use active module

> > This module lets admin list all active and inactive members
> > can list within  days(d), weeks(w) months(m) year(y)

```bash
active 1d
```
> > see inactive memebers in 5days range

```bash
inactive 5d
```

</details>
<details>
<summary>menu</summary>

### How to use menu

```bash
menu
```
</details>
<details>
<summary>additions</summary>

### How to Use the Additions Bot Commands

> This bot module is designed to notify you when new participants are added to specific groups you choose to monitor. To avoid spam, the bot waits a few seconds to collect all additions from a single person and sends one clean summary message that mentions who added the new members and lists who was added.

**Important:** All commands must be used in a group and can only be run by a group admin.

***

#### ➡️ `additiongroup <group_jid> [...]`

> > This command tells the bot to **start monitoring** one or more groups for new additions. You can add multiple groups at once by separating their JIDs with a space or by providing them on separate lines.

> Turn on or off

```bash
additions on
```

* **Usage 1 (single line)**: Type `additiongroup` followed by the full JIDs of the groups you want to monitor.
* **Example**: `additiongroup 120300123456789012@g.us 120300987654321012@g.us`
* **Usage 2 (multi-line)**: Type `additiongroup` on the first line, then enter the JIDs on subsequent lines.
* **Example**:

```bash
    additiongroup
    120300123456789012@g.us
    120300987654321012@g.us
```

---

```bash
deladditiongroup <group_jid|index> [...]
```

```bash
removeadditiongroup <group_jid|index> [...]
```
> This command tells the bot to **stop monitoring** one or more groups. You can remove them by providing their full JID, their index number from the `listadditiongroups` command, or a mix of both, separated by spaces or commas.

* **Usage**: Type `deladditiongroup` or `removeadditiongroup` followed by the JID(s) or index number(s) to remove.
* **Example (by JID)**: `deladditiongroup 120300123456789012@g.us`
* **Example (by index)**: `deladditiongroup 2 4`
* **Example (mixed)**: `deladditiongroup 1 120300987654321012@g.us`

---

#### ➡️ `listadditiongroups` / `additiongroups`

> > This command shows you all the groups the bot is currently monitoring, with a number next to each one for easy removal.

* **Usage**: Simply type `listadditiongroups` or `additiongroups`.
* **Example**: `listadditiongroups`

---

#### ➡️ `additions on|off`
```bash
additions on
additions off
```

> >This command is a global toggle to **enable or disable** the entire additions notification system.

* **Usage**: Type `additions on` to turn it on or `additions off` to turn it off.
* **Example**: 
```bash
additions off
```

---

#### ➡️ `additiontarget <target_jid|clear>`

> > This command sets a specific chat or group where **all** additions notifications will be sent. By default, notifications are sent to the group where the addition happened.

* **Usage**: Type `additiontarget` followed by the JID of the target chat. Use `clear` to revert to the default behavior.
* **Example**: `additiontarget 120300987654321012@g.us`
* **Example to clear**:
```bash
additiontarget clear
```

---

#### ➡️ `additionstatus`

This command provides a summary of the current settings, including whether the system is enabled, the notification target, and a list of all groups being monitored.

* **Usage**: Just type `additionstatus`.
* **Example**: 
```bash
additionstatus
```

</details>
<details>
  <summary>alive</summary>

### How to Use the Alive Bot Commands

> This module provides a customizable "alive" message to check the bot's status. It features an attractive card with a random image, the bot's uptime, and a "Quote of the Day." Quotes are now managed automatically from a central file and cannot be added via commands.

**Important: Usage Modes**

This module has two ways to use commands:
1.  **Group Usage:** Commands are run by **group admins** directly inside a group. They affect only the group where the command is used.
2.  **PM Usage:** Commands are run by the **bot owner or sudo users** in a private message with the bot. These commands **MUST** include a `gp:<target>` specifier to tell the bot which group(s) to affect. The target can be a group's alias, its JID, or `all` for every group.

***

#### ➡️ `alive`

> > Manually sends the alive message.

* **Group Usage**:
    * `alive`: Sends the alive message to the current group.
    * `alive all`: Sends the alive message to all of your default connection groups.
* **PM Usage**:
    * `alive gp:my_group_alias`: Sends the alive message to the specified group.
    * `alive gp:all`: Sends the alive message to all groups the bot is in.

---

#### ➡️ `setalive`

> > Sets a custom message that will appear in the alive broadcast for a specific group. This supports multi-line text.

* **Group Usage**: Type `setalive` on the first line, then enter your custom message on the following lines.
* **Example (in a group)**:
```bash
    setalive
    This is my group's
    custom alive text!
```

* **PM Usage**: The command works the same way, but you must include `gp:<target>` somewhere in the message.
* **Example (in PM)**:

```bash
    setalive
    This is the new message.
    gp:my_group_alias
```

---

#### ➡️ `delalive`

> > Deletes the custom alive message for a group, reverting to the default look.

* **Group Usage**: `delalive`
* **PM Usage**: `delalive gp:my_group_alias`

---

#### ➡️ `alivedaily`

> > Manages the automatic daily sending of the alive message for a group.

* **Group Usage**:
    * `alivedaily`: Shows the current daily status for this group.
    * `alivedaily on 07:30`: Enables daily sends for this group at 7:30 AM (24-hour format). Time is optional and defaults to `08:00`.
    * `alivedaily off`: Disables daily sends for this group.
* **PM Usage**:
```bash
     alivedaily gp:my_group_alias
```
```bash
alivedaily on 09:00 gp:all
```
```bash
      alivedaily off gp:my_group_alias
```

---

#### ➡️ `listquote`

> > Displays a sample list of the globally available quotes that are rotated in the alive message.

* **Usage**: Simply type `listquote`. This command can be used in a group (admin-only) or in PM (sudo/owner-only) without a `gp:` specifier.
* **Example**: 
```bash
listquote
```

</details>
<details>
  <summary>antiedit</summary>


### How to Use the Anti-Edit (Edit Logger) Module

> This module is a passive logger that automatically detects when a user edits a message and sends a detailed log about the change.

**Important:** This module has **no commands**. It works automatically in the background. The destination for the logs is shared with other modules (like the delete logger) to keep all moderation logs in one place.

**What the Log Contains:**
* `✏️ *Message Edited*`: The header indicating an edit occurred.
* `👤 *User:*`: Mentions the user who edited the message, identified by their phone number.
* `💬 *Chat:*`: Shows the group name and JID where the message was edited.
* `🆔 *Message ID:*`: The unique ID of the message that was changed.
* `🔁 *Original Message:*`: A copy of the message content *before* the edit. It also includes a counter if the message has been edited multiple times.
* `✏️ *Edited To:*`: The new message content *after* the edit.

***

### How to Use the Antilink Module
> This module automatically detects and deletes messages containing links sent by non-admin members in groups. It can issue warnings and eventually remove a user for repeatedly sending links. Group admins, sudo users, and whitelisted users/domains are immune.

> > The module features one command to control its logging behavior.

**Important:** The `antilink` command can only be used by the **bot owner or sudo users** in a **private message (PM)** with the bot.

</details>
<details>
  <summary>antilink</summary>

# Antilink Module (v3) Guide

> > Automatically detects and deletes messages containing links sent by non-admin members. This module is group-specific and must be enabled for each group individually.

## Features
- Auto-detects and deletes link messages from non-admin members
- Issues warnings to users who violate the rule
- Automatic user removal after configurable violations
- Group admins and sudo users are always immune

## For Group Admins

> > Control antilink settings for your default connection group(s).

**Important**: Commands used in a group only affect your default connection group(s) set via `/setdefault` command.

### Commands
```bash
antilink on
```

> > > Disable antilink for default group(s)
```bash
antilink off
```

> > > Check antilink status for default group(s)

```bash
antilink status
```

## for sudo or pm


> > > Enable for specific group (alias or JID)

```bash
antilink on gp:mycoolgroup
antilink on gp:1234567890@g.us
```

> > > Enable for ALL groups

```bash
antilink on gp:all
```

> > > Disable for specific group

```bash
antilink off gp:mycoolgroup
```

> > > Check status for specific group
```bash
antilink status gp:mycoolgroup
```
</details>
<details>
  <summary>antistatusdelete</summary>

### ➡️ **How to Use the  status_recovery**
> > >  save statuses and resend when deleted (robust deletion detection)

- Saves statuses (status@broadcast) to disk (data/status/tmp) when enabled.
- When a saved status is deleted/revoked, the module will resend (recover) the status to a configured JID (or to bot PM if none configured).
- Saved files and DB rows are kept for <= 24 hours (auto-cleanup).

---

### ➡️ **commands** (PM or group-admin)

```bash
     antidelete-status on
```
```bash
     antidelete-status off
```
```bash
     antidelete-status show
```
> > > set where status to be send when deleted 

```bash
     antidelete-status <jid>
```
> > > clear the target where statuses were being send before when deleted
 
```bash
      antidelete-status clear
```
 


### must be used in pm and not in group

</details>
<details>
  <summary>antiviewonce</summary>

### How to Use the Anti-Viewonce Module

This module helps you save "view-once" images and videos. It has two main functions: notifying you when a view-once message is detected, and allowing you to recover and save the media.

***

#### How to Recover a View-Once Message

> The recovery process is done by replying to the message you want to save.

1.  Someone sends a view-once message in a chat.
2.  To save it, **reply** directly to that view-once message.
3.  Your reply message **must start with an underscore (`_`)**. The rest of the message doesn't matter. You can simply reply with `_`.
4.  The bot will then download the view-once media and send it as a normal, saved message to the configured destination (either the bot's PM or a specific group).

***

#### Commands

> > Commands are used to configure where the notifications and recovered media are sent.

**Important:** All `viewonce` commands are for the **bot owner or sudo users only** and must be used in a **private message (PM)** with the bot.

#### ➡️ `viewonce`

> > This is the main command for managing settings.

* **Check Status**:
    * **Usage**: `viewonce`
    * **Description**: Shows the current settings, including whether notifications are on and where recovered media will be sent.

* **Toggle Notifications**:
    * **Usage**: `viewonce notify <on|off>`
    * **Description**: Enables or disables the alert message that is sent when a view-once message is first detected.
    * **Example**: `viewonce notify on`

* **Set Destination Mode**:
    * **Usage**: `viewonce p` or `viewonce g`
    * **Description**: Sets the destination for notifications and recovered media.
        * `p` (or `pm`): Sends everything to the bot's private chat.
        * `g` (or `group`): Sends everything to a specific group. You must set the target JID for this to work.

* **Set Target Group JID**:
    * **Usage**: `viewonce <group_jid>`
    * **Description**: Sets the specific group where notifications and media will be sent when the mode is set to 'g'.
    * **Example**: `viewonce 120363043812345678@g.us`

* **Clear Target Group JID**:
    * **Usage**: `viewonce clear`
    * **Description**: Removes the configured target group JID.

</details>


<details>
  <summary>autoreactstatus</summary>

### How to Use the Auto React Status Module

> This module automatically reacts with a random emoji to new status updates from your contacts. The feature is disabled by default and must be turned on to function.

> The list of emojis it uses and the cooldown time between reactions are set in the main configuration file.

***

#### Commands

> Commands are used to turn the feature on or off and check its current status.

**Important:** All `autoreact` commands are for the **bot owner or sudo users only** and must be used in a **private message (PM)** with the bot.

#### ➡️ `autoreact <on|off|status>`

* **Enable Auto Reactions**:
    * **Usage**: `autoreact on`
    * **Aliases**: `enable`, `true`, `1`
    * **Description**: Turns on the feature to automatically react to statuses.

* **Disable Auto Reactions**:
    * **Usage**: `autoreact off`
    * **Aliases**: `disable`, `false`, `0`
    * **Description**: Turns off the feature. This is the default state.

* **Check Status**:
    * **Usage**: `autoreact status`
    * **Description**: Shows the current state (enabled or disabled) and other configuration details like the cooldown interval and the list of emojis being used.

</details>
<details>
  <summary>autoread</summary>

### How to Use the Auto Read Receipt Module

> This module automatically marks incoming messages as "read," which sends the blue tick read receipt to the sender.

***

#### How It Works & Configuration

> This module is entirely passive and has **no commands**. Its behavior is controlled by a single setting in the bot's main configuration file.

* **Setting**: `AUTOREAD_MESSAGES`

* **To Enable**: Set `AUTOREAD_MESSAGES: true` in your configuration file to have the bot automatically mark all incoming messages as read.

* **To Disable**: Set `AUTOREAD_MESSAGES: false` or remove the line entirely. The feature is disabled by default.

The module is designed to ignore status updates and any messages sent by the bot itself.

</details>
<details>
  <summary>autoviewstatus</summary>

### How to Use the Auto View Status Module

> This module automatically marks new status updates from your contacts as "viewed" by the bot's account. When enabled, the bot will silently view statuses as they are posted. The feature is disabled by default.

***

#### Commands

Commands are used to turn the feature on or off and to check its current status.

**Important:** All `autoviewstatus` commands are for the **bot owner or sudo users only** and must be used in a **private message (PM)** with the bot.

#### ➡️ `autoviewstatus <on|off|status>`

* **Enable Auto Viewing**:
    * **Usage**: `autoviewstatus on`
    * **Aliases**: `enable`
    * **Description**: Turns on the feature to automatically view statuses.

* **Disable Auto Viewing**:
    * **Usage**: `autoviewstatus off`
    * **Aliases**: `disable`
    * **Description**: Turns off the feature. This is the default state.

* **Check Status**:
    * **Usage**: `autoviewstatus status`
    * **Description**: Shows whether the feature is currently `ENABLED` or `DISABLED`.

---
---
---

### How to Use the Video Note Converter (cc) Module

> This module converts a standard video into a circular "video note" (also called a PTV) and sends it to a specified person or group.

***

#### How to Use

> > There are two ways to use this command:

**1. Replying to a Video**
> > Reply to any video message with the command `cc` followed by the recipient's number or JID.

* **Example**: Reply to a video with `cc 254712345678`

**2. Sending a Video with a Caption**

> > Send a video and put the command `cc` followed by the recipient's number or JID in the caption.

* **Example**: Send a video with the caption `cc 120363041234567890@g.us`

***

#### Permissions

> > The rules for using this command depend on where you use it:

* **In Private Chat (PM):** Anyone can use the command.
* **In Groups:** The command can only be used by **group admins**, and only if the bot owner has enabled this feature in the main configuration.

</details>
<details>
  <summary>backup</summary>

### ➡️ How to use the Backup & Restore

> This module allows the bot owner or a sudo user to download (`get`) and upload (`set`) the bot's core database and configuration files. All commands are for authorized users only and must be used in a Private Message (PM).

---

### ➡️ `getdb`

> > Downloads the bot's database file as a document. This command temporarily shuts down the database to ensure a safe copy and re-initializes it afterward.

* **Usage**: `getdb [optional_filename]`
* **Example**: `getdb`

---

### ➡️ `setdb`

> > Restores the bot's database using an uploaded file. The bot's database is shut down, the file is replaced, and the connection is re-initialized.

* **Usage**: Attach a `.db` or `.sqlite` file with the caption `setdb`, or reply to the file with the command.
* **Note**: A backup of the old database is created before it's replaced.

---

### ➡️ `getconfig`

> > Downloads the bot's active configuration file (e.g., `config.yml`) as a document.

* **Usage**: `getconfig`

---

### ➡️ `setconfig`

> > Restores the bot's configuration using an uploaded file.

* **Usage**: Attach a `.yml`, `.yaml`, or `.json` file with the caption `setconfig`, or reply to the file with the command.
* **Note**: A bot restart may be required for some changes to take full effect.

</details>
<details>
  <summary>cc</summary>

### How to Use the Video Note Converter (cc) Module

> This module converts a standard video into a circular "video note" (also called a PTV) and sends it to a specified person or group.

***

#### How to Use

> > There are two ways to use this command:

**1. Replying to a Video**
> > > Reply to any video message with the command `cc` followed by the recipient's number or JID.

* **Example**: Reply to a video with `cc 254712345678`

**2. Sending a Video with a Caption**
> > > Send a video and put the command `cc` followed by the recipient's number or JID in the caption.

* **Example**: Send a video with the caption `cc 120363041234567890@g.us`

***

#### Permissions

  - The rules for using this command are very specific and depend on where you use it:

* **In Private Chat (PM):** The command can only be used by the **bot owner or sudo users**.
* **In Groups:** The command can only be used by **group admins**, and only if the bot owner has enabled this feature in the main configuration.

</details>
<details>
  <summary>connection</summary>

### ➡️ `How to use the connection`


> This command lets you set multiline, group-scoped connections. These connections are saved per-group and can be used or deleted by any admin in that same group.
> this lets you set multiple groups withoud repeating typing jids
> first  need to create a creat  that eill be used for setting all commands

* **Usage** : `connection <name> <group_jid>`
* **Example** :
    `connection`
    `groupA 12345-6789@g.us`
    `groupB 98765-4321@g.us`

---

### ➡️ `delconnection`

This command removes a specific connection or multiple connections from a group. You can use the connection name or a comma-separated list of names.

* **Usage** : `delconnection <name>` or `delconnection name1,name2,...` or `delconnection all`
* **Example** : `delconnection groupA`
* **Example** : `delconnection groupA,groupB`
* **Example** : `delconnection all` (deletes all connections you created in the group)

---

### ➡️ `listconnection`

> > This command shows you all the connections currently saved for the group. It lists the names of the connections only, not the JIDs.

* **Usage** : `listconnection`
* **Example** : `listconnection`

---

### ➡️ `setdefault`

> > This command sets the default connection(s) for the group. Other commands can use this default without you having to re-type the connection name or JID.

* **Usage** : `setdefault <name>` or `setdefault name1,name2,...` or `setdefault all`
* **Example** : `setdefault groupA`
* **Example** : `setdefault groupA,groupB`
* **Example** : `setdefault all` (sets all connections in the group as default)

---

### ➡️ `getdefault`

> > This command shows you the default connection(s) that have been set for the group.

* **Usage** : `getdefault`
* **Example** : `getdefault`

</details>
<details>
  <summary>convert</summary>

### ➡️ How to use the Media Converter

> This module provides tools to convert and edit media files. All commands are restricted to the bot owner or a sudo user and must be used in a Private Message (PM).

---

### ➡️ `tomp3`

> > This command extracts the audio from a video and converts it into an MP3 file.

* **Usage**: Reply to a video message with the command. You can optionally provide a filename for the output audio.
* **Example**: Reply to a video and type `tomp3 My Converted Song`.

---

### ➡️ `cutmp3`

> > This command trims or cuts an audio file or a voice note.

* **Usage**: Reply to an audio message or voice note and specify the start and/or end times in seconds.
* **Usage Examples**:
    * `cutmp3 30`: Keeps the audio from 30 seconds onward.
    * `cutmp3 -10`: Removes the last 10 seconds of the audio.
    * `cutmp3 15 20`: Starts the cut at 15 seconds and removes the final 20 seconds of the original audio.
* **Example**: Reply to a voice note and type `cutmp3 5`.

</details>
<details>
  <summary>delete</summary>

### How to Use the Delete Recovery Module

> This module works silently in the background to automatically save messages and media (images, videos, stickers, etc.). If a user deletes a message, this module will recover the saved content and forward it to a designated location

***

#### Commands

> > Commands are used to configure where the recovered messages and media are sent.

**Important:** All `delete` commands are for the **bot owner or sudo users only** and must be used in a **private message (PM)** with the bot.

#### ➡️ `delete`

This is the main command for managing settings.

* **Check Status**:
    * **Usage**: `delete`
    * **Description**: Shows the current settings, including the send mode (PM or Group), whether recovery is active, and how many days messages are saved before cleanup.

* **Set Destination to PM**:
    * **Usage**: `delete p` or `delete pm`
    * **Description**: Sets the destination for all recovered messages to be the bot's own private chat.

* **Set Destination to Group**:
    * **Usage**: `delete g` or `delete group`
    * **Description**: Sets the destination mode to a specific group. You must also set the target JID for this to work.

* **Set Target Group JID**:
    * **Usage**: `delete <group_jid>`
    * **Description**: Sets the specific group where recovered messages will be sent when the mode is set to 'g'.
    * **Example**: `delete 120363043812345678@g.us`

* **Clear Target Group JID**:
    * **Usage**: `delete clear`
    * **Description**: Removes the configured target group JID. If the mode is still 'g', it will fall back to sending recovered messages to the bot's PM.

</details>
<details>
  <summary>dla</summary>

### How to Use the Downloader Module

> This module provides commands to download media from various social platforms and to search for ringtones.

***

#### Permissions

> > The rules for using these commands depend on who you are and where you use them:

* **Bot Owner**: The bot owner can use all commands in any chat.
* **Group Admins**: In a group chat, only group admins can use the commands. The downloaded media will be sent directly to the group.
* **Sudo Users**: In a private chat (PM), only sudo users can use the commands. The downloaded media will be sent to the sudo user's private chat.

***

#### Commands

> > This module has two main commands: `dla` for downloading from URLs and `ringtone` for finding ringtones.

#### ➡️ `dla <URL>`

This is a universal downloader that supports several platforms.

* **Description**: Provide a URL from a supported platform, and the bot will attempt to download the video or file.
* **Supported Platforms**:
    * Twitter (x.com)
    * TikTok
    * Instagram
    * Facebook (fb.watch)
    * Pinterest
    * Mediafire
* **Usage**: `dla <URL_of_media>`
* **Example**: `dla https://www.tiktok.com/@example/video/12345`

---

#### ➡️ `ringtone <search_query>`

> > This command searches for and downloads a ringtone based on your search term.

* **Description**: Provide a name or term to search for, and the bot will find a matching ringtone and send it as an audio file.
* **Usage**: `ringtone <search_term>`
* **Example**: `ringtone mission impossible`

</details>
<details>
  <summary>fetch</summary>

### ➡️ `How to use the fetch`

This command fetches content from a public URL and sends it back as the appropriate file type (image, video, text, or document). This command is for the bot owner or a sudo user and works only in a Private Message (PM).

---

* **Usage**: `fetch <url>`
* **Example**: `fetch https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png`

</details>
<details>
  <summary>filter</summary>

### How to Use the Filter Module (gfilter)

> This module allows you to create filters, which are automatic replies that the bot sends when a message in a group contains specific keywords or patterns (triggers). Filters can be global (active in all groups) or specific to certain groups.

***

#### How It Works & Permissions

> > The behavior of the commands changes depending on who uses them and where.

* **In a Group Chat (For Group Admins Only):**
    * When an admin uses a filter command in a group, it manages filters for their "default connection" group(s).
    * Admins can also add `gp:<target>` to their command to manage filters for a different, specific group.

* **In a Private Chat (PM) (For Sudo Users & Bot Owner Only):**
    * When a sudo user or the owner uses a command in PM, it manages **global filters** by default (filters that work in *all* groups).
    * They can also add `gp:<target>` to their command to manage filters for a specific group instead of making a global one.

***

#### Commands

#### ➡️ `gfilter` (Create or Update a Filter)

> >This command sets up a new filter or overwrites an existing one.

* **Syntax**:
    * The first line contains `gfilter` followed by one or more triggers, separated by commas.
    * The following lines contain the response(s). Each new response must start with a `!`.

* **Example 1: Single Trigger, Single Response**
    ```
    gfilter hello
    !Hi there! How can I help you?
    ```

* **Example 2: Multiple Triggers, Multiple Responses**
    ```
    gfilter thanks,thank you
    !You're welcome!
    !No problem at all.
    ```

* **Example 3: Targeting a Specific Group (using `gp`)**
    ```
    gfilter info
    !Here is the info for the tech group.
    gp:tech_group_alias
    ```

---

#### ➡️ `glistfilter` (List All Filters)

> > This command shows all the active filter triggers.

* **Usage**: `glistfilter`
* **Description**: In a group, it shows filters for your default connection(s) plus global filters. In PM, it shows global filters by default.
* **Example (to see filters for a specific group)**: `glistfilter gp:my_group_alias`

---

#### ➡️ `gdelfilter` (Delete a Filter)

> > This command removes one or more filters.
*Aliases: `gdelfilters`, `gdelf`*

* **Usage**: `gdelfilter <trigger1,trigger2,...>`
* **Description**: Deletes the specified filter trigger(s).
* **Example**: `gdelfilter hello,thanks`

* **Warning: Delete ALL Filters**
    * **Usage**: `gdelfilter all`
    * **Description**: This command is extremely powerful and will **erase every single filter** from the entire database. Use with extreme caution.

---

#### Advanced Matching

> > Besides exact words, you can use advanced patterns for triggers.

* **Wildcard (`*`)**: The `*` acts as a placeholder for any characters.
    * **Example**: A trigger of `go*d` would match "good", "gold", and "goood".

* **Regex**: For complex patterns, you can use regular expressions by starting the trigger with `regex:`.
    * **Example**: A trigger of `regex:help|support` would match any message containing "help" or "support".

</details>
<details>
  <summary>football</summary>

### ➡️ How to use the  Football Commands

> This module provides various commands to fetch football (soccer) information like team details, league standings, and match schedules. Commands can be used by group admins, sudo users, or the bot owner.

---

### ➡️ `.sportshelp`

> > Shows a list of all available football commands.

* **Usage**: `.sportshelp`

---

### ➡️ `.team`

> > Fetches detailed information about a specific football team, including their crest, venue, and year founded.

* **Usage**: `.team <team name>`
* **Example**: `.team Manchester United`

---

### ➡️ `.standings`

> > Displays the current league table for a competition. You must provide the league's official code, which you can find using the `.league` command.

* **Usage**: `.standings <code>`
* **Example**: `.standings PL`

---

### ➡️ `.today`

> > Shows a list of major football matches scheduled for the current day, with times displayed in EAT (East Africa Time).

* **Usage**: `.today`

---

### ➡️ `.next`

> >  Shows the next five upcoming fixtures for a specified team.

* **Usage**: `.next <team name>`
* **Example**: `.next Liverpool`

---

### ➡️ `.live`

> > Fetches a list of up to 10 matches that are currently being played live.

* **Usage**: `.live`

---

### ➡️ `.league`

> > Searches for a league by name to help you find its code for the `.standings` command.

* **Usage**: `.league <league name>`
* **Example**: `.league Bundesliga`

---

### ➡️ `.player`

> > This command is currently unavailable due to API plan limitations.

* **Usage**: `.player <player name>`

</details>
<details>
  <summary>gp</summary>

### How to Use the Groups (gp) Module

> This module acts like a personal address book for the bot. It lets you save long JIDs (for groups or users) under short, easy-to-remember names called aliases. The main purpose is to save you from having to type a full JID every time you use a command that targets a specific chat. Instead of using the JID, you can use the short name you created.

**Important:** All `gp` commands are for the **bot owner or sudo users only**.

***

#### ➡️ `gp add <name> <jid>`

> > Creates or updates a mapping between a name (alias) and a JID.

* **Usage**: `gp add <name> <jid>`
* **Example**: `gp add test 120363380722467155@g.us`

---

#### ➡️ `gp delete <name1> <name2>`

> > Deletes one or more saved aliases. Names can be separated by spaces or commas.
*Aliases: `del`, `remove`, `rm`*.

* **Usage**: `gp delete <name1,name2>`
* **Example**: `gp delete test,chatbot`

---

#### ➡️ `gp list`

> > Lists all registered aliases and the JIDs they point to.
*Alias: `ls`*.

* **Usage**: `gp list`

---

#### ➡️ `gp jids`

> > Lists all the JIDs that have been saved. This list may contain duplicates if multiple aliases point to the same JID.

* **Usage**: `gp jids`

---

#### ➡️ `gp uniquejids`

> > Lists all saved JIDs, but with any duplicates removed.

* **Usage**: `gp uniquejids`

---

#### ➡️ `gp entries`

> > Lists all saved entries as `name -> jid` pairs, one per line.

* **Usage**: `gp entries`

</details>
<details>
  <summary>health</summary>

### How to Use the Health Module

> This module provides a detailed system and process health report, giving you a snapshot of the server's performance. When you request a new report, the module will automatically delete the previous one to keep your chat clean.

***

#### How to Use

> > To get the health report, you must send a command directly to the bot.

* **Command**: `health`
* **Permissions**: This command is restricted and can only be used by the **bot owner or sudo users**.
* **Context**: The command will only work in a **private message (PM)** with the bot. It will not respond in groups.

***

#### What the Report Contains

> > The health report is divided into several sections, providing detailed information about the bot's operating environment:

* **💾 MEMORY USAGE**
    * Shows the RAM used by the bot process.
    * Displays the total system RAM usage (used, total, and free).

* **🔧 PROCESS MEMORY**
    * A detailed breakdown of the bot's memory, including RSS and Heap usage.

* **⚙️ CPU**
    * Shows the server's load average over 1, 5, and 15 minutes.
    * Lists the number of CPU cores.
    * Displays the CPU time used by the bot process.

* **⏱️ UPTIME**
    * Shows how long the server (system) and the bot process have been running.

* **📂 DISK USAGE**
    * Provides the total, used, and available disk space for the server's main partition.

* **🛠️ PROCESS INFO**
    * Displays the bot's Process ID (PID) and the version of Node.js it is running on.

</details>

<details>
  <summary>img</summary>

### ➡️ How to use the `img`

> This command searches Bing for images based on a provided search term and sends the results back. This command is for the bot owner or a sudo user only.

---

* **Usage**: `img [number] <search term>`.
* **Note**: You can optionally specify the number of images to return. The default is 6, and the maximum is also capped at 6.
* **Example (Default Count)**: `img sunsets`.
* **Example (Specific Count)**: `img 3 trees`.

</details>
<details>
  <summary>jid</summary>

### How to Use the JID Module

> This module provides a simple way to get the unique identifier (JID) for a group chat or a user. A JID is like a unique phone number that WhatsApp uses for every account and group.

***

#### How to Use

> > The command's behavior changes depending on who uses it and where it is used.

* **Command**: `jid`

#### In a Group Chat

* **Permissions**: The command can only be used by **group admins**. If a non-admin uses it, the bot will send a reply stating this restriction.
* **Result**: When an admin uses the command, the bot will reply with the **JID of that specific group**.

#### In a Private Chat (PM)

> > The response in a private chat depends on the user's permission level.

* **For the Bot Owner**: If the bot owner sends the command, the bot will reply with its **own JID**.
* **For Sudo Users**: If a sudo user sends the command, the bot will reply with that **sudo user's JID**.
* **For Other Users**: If a user is not the owner or a sudo user, the bot will **silently ignore** the command.

</details>
<details>
  <summary>kick</summary>

### How to Use the Kick Module

> This module provides commands for removing members from a group.

***

#### Permissions

**Important**: All commands in this module can only be used by **group admins**.

***

#### Commands

> > There are two ways to kick members: one at a time or all at once.

---

#### Kicking a Single Member

> > To kick one person, you must reply to one of their messages.

* **Command**: `kick`
* **How to Use**:
    1.  Find a message from the person you want to remove.
    2.  Reply to that message.
    3.  Type `kick` in your reply text.
    * The bot will then remove the user who sent the original message.

---

#### Kicking All Members

> > > This is a two-step process to prevent accidental removal of all members.

**Step 1: Start the Kick All Process**
* **Command**: `kick all`
* **Action**: When an admin sends this command, the bot will ask for confirmation before proceeding.

**Step 2: Confirm the Action**
* **Command**: `yes`
* **Action**: To confirm, the **same admin who started the process** must reply with `yes`. Replies from other users will be ignored.
* **Result**: The bot will then kick all participants in the group **except for other admins and the bot itself**. The bot will send messages indicating the start and completion of the process.

</details>
<details>
  <summary>leave</summary>

### How to Use the Leave Message Module

> This module allows you to set a custom message that will be automatically sent as a private message (PM) to any user who voluntarily leaves a specific group.

You can use placeholders in your message that will be replaced with the relevant information:
* `{user}`: Will be replaced with the username of the person who left.
* `{group}`: Will be replaced with the name of the group they left.

***

#### Permissions & Command Context

> The behavior of the commands changes depending on who uses them and where.

* **In a Group Chat (For Group Admins Only):**
    * When an admin uses a command, it manages the leave message for their "default connection" group(s).

* **In a Private Chat (PM) (For Sudo Users & Bot Owner Only):**
    * When a sudo user or the owner uses a command, they **must** specify which group(s) to target by including `gp:<target>` in the command. The `<target>` can be a group alias, a full JID, or `all` to affect all groups.

***

#### Commands

#### ➡️ `lvc` (Leave Message Configuration)

This is the main command to set, enable, or disable the leave message.

* **Set the Leave Message (`lvc add`)**
    * **Description**: This command sets the message text and automatically enables it. The message can be multiple lines.
    * **Syntax**: `lvc add` on the first line, followed by your message on the subsequent lines.
    * **PM Example**:
        ```
        lvc add
        Goodbye {user}! We're sorry to see you leave {group}.
        gp:my_group_alias
        ```
    * **Group Example**:
        ```
        lvc add
        Goodbye {user}! We're sorry to see you leave {group}.
        ```

* **Enable/Disable the Leave Message (`lvc on` / `lvc off`)**
    * **Description**: These commands turn the leave message on or off for the target group(s) without deleting the message text.
    * **Usage**: `lvc on` or `lvc off`. In PM, you must include `gp:<target>`.
    * **PM Example**: `lvc off gp:all`
    * **Group Example**: `lvc on`

---

#### ➡️ `dellvc` (Delete a Leave Message)

> > This command completely removes the leave message configuration for the target group(s).

* **Usage**: `dellvc`. In PM, you must include `gp:<target>`.
* **PM Example**: `dellvc gp:my_group_alias`
* **Group Example**: `dellvc`

</details>
<details>
  <summary>lock</summary>

### How to Use the Lock Module

> This module allows you to "lock" certain words or phrases in a group. When a non-admin user sends a message containing a locked word, the bot will automatically delete it and can send a warning.

***

#### Permissions & Command Context

> > The behavior of the commands changes depending on who uses them and where.

* **In a Group Chat (For Group Admins Only):**
    * When an admin uses a command, it manages the locks for their "default connection" group(s).

* **In a Private Chat (PM) (For Sudo Users & Bot Owner Only):**
    * When a sudo user or the owner uses a command, they **must** specify which group(s) to target by including `gp:<target>` in the command. The `<target>` can be a group alias, a full JID, or `all`.

***

#### Commands

##### ➡️ `lock <word1,word2,...>`
Locks one or more words, preventing non-admins from using them.
* **Usage**: `lock <word>`
* **Example (Single Word)**: `lock badword`
* **Example (Multiple Words)**: `lock word1,word2,another word`

##### ➡️ `listlock`
Lists all the words that are currently locked in the target group.
* **Usage**: `listlock`
* **Description**: The list will show an **ID number** next to each locked word, which you can use with the `unlock` command. It also indicates the match type.

##### ➡️ `unlock <ID_or_phrase>`
Unlocks a word, allowing it to be used again.
* **Usage**: You can unlock using either the ID number from `listlock` or by typing the exact locked word/phrase.
* **Example (by ID)**: `unlock 123`
* **Example (by Phrase)**: `unlock badword`

##### ➡️ `unlockall`
Removes **all** locked words from the target group. Use this with caution.
* **Usage**: `unlockall`

##### ➡️ `locknotify <on|off>`
Toggles admin notifications. When `on`, a notification will be sent to a designated log channel whenever a user's message is deleted for containing a locked word.
* **Usage**: `locknotify on` or `locknotify off`

---

#### Advanced Locking

You can lock more than just exact words by using special prefixes.

* **Wildcard (`*`)**: The `*` can stand in for any characters.
    * **Example**: `lock b*d` will lock "bad", "bed", "blood", etc.

* **Regex**: For very complex patterns, you can use regular expressions.
    * **Example**: `lock regex:bad(word|phrase)` will lock "badword" and "badphrase".

</details>
<details>
  <summary>lyrics</summary>

### ➡️ `lyrics`

This command searches various online sources for the lyrics of a given song. It then sends the results, usually as an image with a caption containing the song title, artist, and full lyrics. This command is for the bot owner or a sudo user only.

---

* **Usage**: `lyrics <song name>`
* **Example**: `lyrics Bohemian Rhapsody`

</details>
<details>
  <summary>mforward</summary>

### How to Use the Multi-Forward (mgf) Module

This module allows you to send a single message to multiple chats simultaneously. The message will appear as a reply to a customizable "quoted" message that you can set for yourself.

***

#### Permissions

* **In a Group Chat**: The `mgf` command can only be used by **group admins**.
* **In a Private Chat (PM)**: The `mgf` command can be used by **all users**.

***

#### Sending a Message

By default, the message is sent to your "default connection(s)". You can also specify different recipients.

* **Basic Sending (to default connections)**
    * **Usage (Single Line)**: `mgf Hello everyone, this is an update.`
    * **Usage (Multi-Line)**:
        ```
        mgf
        This is a multi-line
        message update.
        ```

* **Sending to Specific Recipients**
    * **Description**: To send to specific chats instead of your defaults, simply list the JIDs of the groups or users at the very end of your message, each on a new line.
    * **Example**:
        ```
        mgf
        This message is for the dev and test groups only.
        120363041234567890@g.us
        120363029876543210@g.us
        ```

---

#### Managing Your Custom Quote

Each user can set their own personal quote. If no custom quote is set, a default one will be used.

* **Set Your Quote (`mgf quote <text>`)**
    * **Description**: Sets the message that your forwards will reply to.
    * **Usage (Single Line)**: `mgf quote This is my new official quote.`
    * **Usage (Multi-Line)**:
        ```
        mgf quote
        This is a longer,
        multi-line quote.
        ```

* **Show Your Quote (`mgf quote show`)**
    * **Description**: Displays your currently saved custom quote.
    * **Usage**: `mgf quote show`

* **Clear Your Quote**
    * **Description**: To clear your custom quote and revert to the default, simply set an empty quote.
    * **Usage**:
        ```
        mgf quote
        
        ```

</details>
<details>
  <summary>movie</summary>

### ➡️ `movie`

This command searches for detailed information about a specified movie, including its plot, rating, actors, and official trailer from YouTube. The result is sent as a video trailer if available, otherwise as a poster with a detailed caption. This command is for the bot owner or a sudo user only.

---

* **Usage**: `movie <movie name>`
* **Example**: `movie Inception`

</details>
<details>
  <summary>pfilter</summary>

### How to Use the PM Filter Module (pfilter)

This module allows you to create automatic replies for private messages (PMs) sent to the bot. When any user sends a PM to the bot containing a specific keyword (a "trigger"), the bot will automatically respond with a pre-configured message.

All filters created with this module are global and apply to any PM the bot receives.

***

#### Permissions

* **Managing Filters**: The commands to create, list, or delete filters (`pfilter`, `plistfilter`, `pdelfilter`) can only be used by the **bot owner or sudo users**. These commands must be sent in a **private message (PM)**.
* **Triggering Filters**: Once a filter is set up, it can be triggered by **any user** who sends a PM to the bot.

***

#### Commands

#### ➡️ `pfilter` (Create or Update a PM Filter)

This command sets up a new PM filter or overwrites an existing one.

* **Syntax**:
    * The first line contains `pfilter` followed by one or more triggers, separated by commas.
    * The following lines contain the response(s). Each new and distinct response must start with a `!`.

* **Example**:
    ```
    pfilter hello,hi,hey
    !Hello! This is an automated response.
    !Hi there! How can I assist you today?
    ```

---

#### ➡️ `plistfilter` (List All PM Filters)

This command shows all the active PM filter triggers.

* **Usage**: `plistfilter`

---

#### ➡️ `pdelfilter` (Delete a PM Filter)

This command removes one or more PM filters.
*Aliases: `pdelfilters`, `pdelf`*

* **Usage**: `pdelfilter <trigger1,trigger2,...>`
* **Example**: `pdelfilter hello,hi`

* **Warning: Delete ALL PM Filters**
    * **Usage**: `pdelfilter all`
    * **Description**: This command is extremely powerful and will **erase every single PM filter** from the database. Use with extreme caution.

---

#### Advanced Matching

Besides exact words, you can use advanced patterns for triggers.

* **Wildcard (`*`)**: The `*` acts as a placeholder for any characters.
    * **Example**: A trigger of `price*` would match "price", "prices", and "pricing".

* **Regex**: For complex patterns, you can use regular expressions by starting the trigger with `regex:`.
    * **Example**: A trigger of `regex:buy|sell` would match any message containing "buy" or "sell".

</details>
<details>
  <summary>ping</summary>

### How to Use the Ping Module

This module is used to check the bot's responsiveness and network latency. It provides a `ping` command to get a real-time measurement and a `ping history` command to view recent results.

***

#### Permissions

**Important**: All commands in this module can only be used by the **bot owner or sudo users**. Requests from other users will be silently ignored.

***

#### Commands

##### ➡️ `ping`
Measures the bot's current latency. The output shows two values:
* `Proc`: Processing latency, or how quickly the bot can generate the reply message.
* `Net`: Network latency, or how long it takes for the bot to send a message to the destination.

**Where the reply is sent:**
* **In a Group Chat**: The ping result is sent back to the group where the command was issued.
* **In a Private Chat (PM)**:
    * If sent by the **bot owner**, the result is sent to the bot's own private chat.
    * If sent by a **sudo user**, the result is sent to that sudo user's private chat.

---

##### ➡️ `ping history`
Displays a list of the last 20 ping measurements taken.
*Alias: `ping stats`*

**Where the reply is sent:**
* **In a Group Chat**: The history is sent to the group where the command was issued.
* **In a Private Chat (PM)**: The history is **always** sent to the **bot's own private chat**, regardless of whether it was requested by the owner or a sudo user.

</details>
<details>
  <summary>reboot</summary>

### ➡️ `reboot`

This command lets you restart the bot's system. It is only accessible to the bot's owner and works only in private chats.

* **Usage** : `reboot`
* **Example** : `reboot`

---

* **Note** :
    * This command can only be used in a private chat with the bot.
    * Only the bot's owner can use this command.
    * This command will send a "Rebooting bot..." message before restarting the system.

</details>
<details>
  <summary>sbl</summary>

### ➡️ Status Lock

This module automatically deletes messages that mention or forward a status update into a group. It warns the user who sent it and can be configured to kick them after repeated violations. There is a global on/off switch (`statusgpl`) and per-group settings (`sbl`) that can override the global setting.

---

### ➡️ `statusgpl` (Global Lock Control)

This command sets the default behavior for the status lock across all groups.

* **Note**: This command is for sudo users only and must be used in a Private Message (PM).
* **Usage**: `statusgpl <on|off|show>`.
* **Example**: `statusgpl on`.

---

### ➡️ `sbl` (Per-Group Lock Control)

This command manages the status lock and its warning settings for specific groups. Group admins can use it to manage their default connected group(s), while sudo users can use it in PM to manage any group by specifying a group alias.

* **`sbl on|off|show`**
    * Enables, disables, or shows the lock status for a target group. `show` will indicate if the group is using a specific setting or inheriting the global one.
    * **Usage (Admin)**: `sbl on`.
    * **Usage (Sudo)**: `sbl on gp <group_alias>`.

* **`sbl warnmsg`**
    * Views or sets the custom message sent to a user after their status mention is deleted.
    * **Usage (View)**: `sbl warnmsg`.
    * **Usage (Set)**: `sbl warnmsg set <message>`.
    * **Note**: You can use placeholders: `{user}`, `{max_warns}`, `{remaining_warns}`.
    * **Example**: `sbl warnmsg set @{user}, please do not share statuses here.`.

* **`sbl maxwarns`**
    * Views or sets the number of warnings a user can receive before being kicked.
    * **Usage (View)**: `sbl maxwarns`.
    * **Usage (Set)**: `sbl maxwarns set <number>`.
    * **Example**: `sbl maxwarns set 3`.

* **`sbl resetwarns`**
    * Resets the warning count for a specific user to zero.
    * **Usage**: `sbl resetwarns @user`.

</details>
<details>
  <summary>sched</summary>

### ➡️ `sched` (Schedule)

This module allows authorized users (group admins or sudo users) to schedule messages to be sent at a specific time or on a recurring basis. Group admins manage schedules for their default connected group(s). Sudo users must specify a target group via PM using `gp:<alias>`.

---

### ➡️ `sched add`

Schedules a new message. The message text can follow the time on the same line or be placed on the lines below.

* **Usage**: `sched add <time> <message>`.
* **Time Formats**:
    * `HH:mm` (e.g., `14:30`) for a daily recurring message.
    * `in N minutes/hours/days` (e.g., `in 30 minutes`) for a one-time message.
    * `YYYY-MM-DDTHH:mm` (e.g., `2025-12-25T10:00`) for a one-time message.
* **Example**: `sched add 08:00 Good morning team!`.

---

### ➡️ `sched once`

Schedules a one-time message. You can optionally specify a number of days in the future.

* **Usage**: `sched once <HH:mm> [Ndays] <message>`.
* **Example**: `sched once 20:00 7 This is a reminder for next week's event`.

---

### ➡️ `sched list`

Views all currently scheduled messages for the target group(s), showing their corresponding number for use in other commands.

* **Usage**: `sched list`.

---

### ➡️ `sched delete`

Deletes one, multiple, or all scheduled messages. Use the number from `sched list` to identify which message to delete.

* **Usage**: `sched delete <number|number,number,...|all>`.
* **Example**: `sched delete 3` or `sched delete 1,5`.

---

### ➡️ `sched edit`

Changes the time of an existing scheduled message.

* **Usage**: `sched edit <number> <new_time>`.
* **Example**: `sched edit 2 15:00`.

---

### ➡️ `sched frequency`

Sets the repeat interval for a recurring message. For example, `1` for daily, `2` for every two days, `7` for weekly, etc.

* **Usage**: `sched frequency <number> <n>`.
* **Example**: `sched frequency 2 7` (sets schedule #2 to repeat every 7 days).

---

### ➡️ `sched disable` / `sched enable`

Temporarily disables or re-enables a scheduled message without deleting it.

* **Usage**: `sched <disable|enable> <number>`.
* **Example**: `sched disable 4`.

</details>
<details>
  <summary>setpp</summary>

### ➡️ `setpp`

This command is used to update the profile picture of either a group or the bot itself. The command's behavior and authorization depend on where it is used.

* **Usage in a Group**
    * **Action**: Changes the group's profile picture.
    * **Authorization**: Can only be used by group admins.
    * **How to use**: Reply to an image with `setpp`.

* **Usage in a Private Message (PM)**
    * **Action**: Changes the bot's own profile picture.
    * **Authorization**: Can only be used by the bot owner or a sudo user.
    * **How to use**: Reply to an image with `setpp`.

---

* **Example**: Reply to the desired image and send the message `setpp`.

</details>
<details>
  <summary>spam</summary>

### ➡️ `spam`

This module automatically detects and manages message spam in groups. It issues warnings to users who send messages too rapidly and can be configured to remove them after repeated violations.

---

### ➡️ `spam`

This command controls the spam detection feature. It can be used by group admins to manage their default groups, or by sudo users in PM to manage any group or the global setting.

* **Actions**: `on`, `off`, `show`.

* **Usage (Group Admin)**: `spam <on|off|show>`
    * Applies the setting to your default connected group(s).
    * **Example**: `spam on`

* **Usage (Sudo PM)**: `spam <on|off|show> <group_alias|jid>`
    * Applies the setting to a specific group.
    * **Example**: `spam off my_group`

* **Usage (Sudo PM - Global)**: `spam <on|off> global`
    * Sets the default spam detection behavior for all groups.
    * **Example**: `spam on global`

---

### ➡️ `resetspam`

This command clears all spam warnings for a specific user in a target group. You must @mention the user you want to reset.

* **Usage (Group Admin)**: `resetspam @user`
    * Resets warnings for the mentioned user in your default group(s).
    * **Example**: `resetspam @someUser`

* **Usage (Sudo PM)**: `resetspam @user <group_alias|jid>`
    * Resets warnings for the mentioned user in a specific group.
    * **Example**: `resetspam @someUser my_group`

</details>
<details>
  <summary>status</summary>

### ➡️ `autostatus`

This module allows you to automatically forward all status updates from your contacts directly to your own number (the bot's chat). This lets you view and save statuses without marking them as seen.

**Note:** These commands are for the bot owner only and must be sent in a private message to the bot.

---

### ➡️ `autostatus on`

Enables the automatic forwarding of all incoming status updates.

* **Usage**: `autostatus on`

---

### ➡️ `autostatus off`

Disables the automatic forwarding of statuses.

* **Usage**: `autostatus off`

---

### ➡️ `autostatus show`

Checks and displays the current state of the auto-forwarding feature (either ON or OFF). This is the default action if you just type `autostatus`.

* **Usage**: `autostatus show` or `autostatus`

</details>
<details>
  <summary>sticker</summary>

### ➡️ Sticker Module

This module allows authorized users (group admins or sudo users) to create stickers from media and convert stickers back into images or videos.

---

### ➡️ `sticker` or `s`

This command creates a sticker from an image or a short video.

* **Alias**: `s`.
* **Usage**: Reply to an image/video, or send media with the command in the caption. You can optionally provide an author name.
* **Note**: Videos for animated stickers must be 15 seconds or shorter.
* **Example**: Reply to an image and type `sticker MyPack`.

---

### ➡️ `toimage`

This command converts a static (non-animated) sticker back into a PNG image.

* **Usage**: You must reply to a **static sticker** for this command to work.
* **Example**: Reply to a regular sticker and type `toimage`.

---

### ➡️ `tovideo`

This command converts an animated sticker back into a video.

* **Usage**: You must reply to an **animated sticker** for this command to work.
* **Example**: Reply to an animated sticker and type `tovideo`.

</details>
<details>
  <summary>sudo</summary>

### ➡️ `sudo`

This module is for the bot owner only and is used to manage "sudoers"—users who are granted special permissions to use other restricted bot commands. All `sudo` commands must be run by the bot's owner.

---

### ➡️ `sudo add`

Adds a user to the sudo list, granting them elevated permissions. You can use a phone number or a full JID.

* **Usage**: `sudo add <jid|number>`
* **Example**: `sudo add 254712345678`

---

### ➡️ `sudo delete`

Removes one or more users from the sudo list, revoking their special permissions. You can provide multiple entries separated by commas or spaces.

* **Aliases**: `del`, `remove`, `rm`
* **Usage**: `sudo delete <jid1,jid2,...>`
* **Example**: `sudo delete 254712345678,254700000000`

---

### ➡️ `sudo list`

Displays all users who currently have sudo permissions.

* **Alias**: `ls`
* **Usage**: `sudo list`
* **Example**: `sudo list`

</details>
<details>
  <summary>tag</summary>

### ➡️ `cmd` (Tag & Mention)

This module allows admins to create custom emoji-based shortcuts to mention all members, list all members, or send a predefined message to their "default" group(s). All commands and triggers are admin-only.

**Important:** All actions (like tagging or listing) are sent to the admin's configured default group(s), not necessarily the chat where the command is typed.

---

### ➡️ `cmd add`

Creates a new emoji-triggered command.

* **Usage**: `cmd add <emoji> <mapping>`
* **Example**: `cmd add 👋 @ Hello everyone!`

---

### ➡️ `cmd list`

Displays all saved commands for your default group(s).

* **Usage**: `cmd list`

---

### ➡️ `cmd delete`

Removes one or all saved commands.

* **Usage**:
    * `cmd delete <emoji>`
    * `cmd delete index <number>`
    * `cmd delete all`
* **Example**: `cmd delete 👋` or `cmd delete index 1`

---

### ➡️ Mapping Types Explained

The `<mapping>` tells the bot what to do when the emoji is used.

* **Mention All (`@`)**: Tags every member in the group. The text after `@` is the message.
    * **Example Mapping**: `@ Team meeting starts now!`

* **List All (`@@`)**: Lists all members by name, tags them, and appends your message.
    * **Example Mapping**: `@@ Please confirm your attendance.`

* **Raw Text**: Simply sends the mapping as a plain text message.
    * **Example Mapping**: `Here is the link to the report: https://...`

---

### ➡️ Using a Saved Command

To trigger a saved command, simply type the emoji in any chat. The action will be performed in your default group. Any text you type after the emoji will be added to the end of the mapped message.

* **Usage**: `<emoji> [optional additional text]`
* **Example**: If `📣` is mapped to `@ Important Update`, typing `📣 The server will be down for maintenance.` will tag everyone with the full message.

---

### ➡️ Direct Tagging (No Saved Command Needed)

Admins can also perform a direct mention or list without creating a command first. Just type `@` or `@@` followed by your message in any chat.

* **Usage (Mention All)**: `@ <your message>`
* **Usage (List All)**: `@@ <your message>`
* **Example**: `@ Quick huddle in 5 minutes.`

</details>
<details>
  <summary>tiktok</summary>

### How to Use the TikTok Downloader Bot Command

This bot module allows you to download TikTok videos directly within your group chats by providing the video's URL.
downloads without sticker and even restricted to download

***
💯

---

#### ➡️ `tiktok <video_url>`

Downloads a TikTok video from the provided URL and sends it as a video message to the group.

* **Usage**: `tiktok <TikTok video URL>`
* **Example**: `tiktok https://www.tiktok.com/@username/video/1234567890123456789`
* **Behavior**:
    1.  The bot will first send a "⏳ Processing TikTok video…" message.
    2.  Once downloaded, the video will be sent to the group with a "✅ TikTok download complete." caption.
    3.  In case of an error during download, an error message will be sent to the group.

</details>
<details>
  <summary>time</summary>

### ➡️ `time`

The `time` module allows authorized users (sudo) to get the current date and time for a specific location. You can provide a country, a major city, or a standard IANA timezone name. This is a PM-only command and will be ignored in groups.

---

### ➡️ `time <location>`

Retrieves the current time for the specified location.

* **Usage**: `time <country|city|timezone>`
* **Example (Country)**: `time Kenya`
* **Example (City)**: `time Nairobi`
* **Example (Timezone)**: `time Europe/London`

</details>
<details>
  <summary>update</summary>

### 🔄 How to Use the `update` Command

The `update` command vailable.

---

#### ➡️ `update`

* **Purpose**: Check for available updates.

</details>
<details>
  <summary>url</summary>

### How to Use the URL Uploader Module

This module allows you to get a permanent public link for a media file. It works by uploading the media you provide to a cloud service (Cloudinary) and giving you back the URL.

***

#### How to Use

The command is simple and works by replying to a message.

1.  Find a message with the media you want to upload. It can be an **image, video, audio, or document**.
2.  **Reply** to that message.
3.  In your reply, simply type the command: `url`
4.  The bot will process the file and send you the public link.

**Note:** There is a **50MB size limit for videos**.

***

#### Permissions

This command is restricted to authorized users.

* **Usage**: The command can only be used by the **bot owner or sudo users**.
* **Response**: The bot will always send the final URL to you in your **private chat (PM)**.

</details>
<details>
  <summary>var</summary>

### ➡️ `var`

The `var` module allows authorized users (sudo) to dynamically view and edit the bot's `config.yml` file directly from a private message (PM). This is a powerful tool for live configuration changes without restarting the bot. This command only works in PM and ignores all group messages.

---

### ➡️ Setting a Variable

This is the primary command to set or update a configuration key.

* **Usage**: `var <KEY>=<VALUE>` or `var +<KEY>=<VALUE>`
* **Example**: `var STATUS_BROADCAST=true`
* **Example**: `var +YT_COOKIE=your_cookie_value_here`

---

### ➡️ Setting the Command Prefix

You can set a single prefix or multiple space-separated prefixes for the bot.

* **Usage**: `var PREFIX=<prefix(es)>`
* **Example (Single)**: `var PREFIX=?`
* **Example (Multiple)**: `var PREFIX=. ! /`

---

### ➡️ Enabling/Disabling Features

Quickly toggle core features on or off. This is an alias for setting keys like `ANTILINK.DEFAULT_ENABLED`.

* **Usage**: `var <FEATURE>=<on|off>`
* **Supported Features**: `SPAM`, `ANTILINK`, `WELCOME`, `LOCKS`
* **Example**: `var ANTILINK=on`
* **Example**: `var WELCOME=off`

---

### ➡️ Commenting a Variable

This disables a configuration key by commenting it out in the `config.yml` file. Using `null` as the value achieves the same result.

* **Usage**: `var -<KEY>` or `var <KEY>=null`
* **Example**: `var -PORT`
* **Example**: `var PREFIX=null`

---

### ➡️ Listing Variables

Lists all the variables that are currently specified in the `config.yml` file, helping you see what can be configured.

* **Usage**: `var list`
* **Example**: `var list`

</details>
<details>
  <summary>warn</summary>

### ➡️ Warn System

This module provides a comprehensive warning system for groups. Admins can manually warn users, and the bot can automatically warn and delete messages containing blocked words or media types. When a user reaches the maximum number of warnings, they are automatically removed from the group. Sudo users can manage blocklists for groups via PM.

---

### ➡️ `/warn`

Manually issues a warning to a user. This is a **group-only** command for admins.

* **Usage**: `/warn [optional reason]` (reply to a user's message) OR `/warn @user [optional reason]`
* **Example (Reply)**: Reply to a message and type `/warn Please stay on topic.`
* **Example (Mention)**: `/warn @user1 Continued spamming.`

---

### ➡️ `/warnlock`

Adds one or more items to the automatic warning blocklist. Items can be words or media types. To block a media type, prefix it with `*` (e.g., `*img`, `*vid`, `*pdf`, `*zip`).

* **Usage (Group Admin)**: `/warnlock <item1> <item2> ...`
* **Example (Group Admin)**: `/warnlock badword *pdf *exe`
* **Usage (Sudo PM)**: `warnlock <item1> gp:<alias|jid|all>`
* **Example (Sudo PM)**: `warnlock spamlink *img gp:my_awesome_group`

---

### ➡️ `/warnunlock`

Removes one or more items from the blocklist.

* **Usage (Group Admin)**: `/warnunlock <item1> <item2> ...`
* **Example (Group Admin)**: `/warnunlock badword *pdf`
* **Usage (Sudo PM)**: `warnunlock <item1> gp:<alias|jid|all>`
* **Example (Sudo PM)**: `warnunlock spamlink gp:all`

---

### ➡️ `/warnlist`

Displays all items currently in the blocklist.

* **Usage (Group Admin)**: `/warnlist`
* **Example (Group Admin)**: `/warnlist`
* **Usage (Sudo PM)**: `warnlist gp:<alias|jid|all>`
* **Example (Sudo PM)**: `warnlist gp:my_awesome_group`

---

### ➡️ `/resetwarns`

Resets a user's warning count to zero.

* **Usage (Group Admin)**: `/resetwarns` (reply to a user) OR `/resetwarns @user`
* **Example (Group Admin)**: Reply to a user's message and type `/resetwarns`.
* **Usage (Sudo PM)**: `resetwarns <@user|jid> gp:<alias|jid|all>`
* **Example (Sudo PM)**: `resetwarns @1234567890 gp:my_awesome_group`

</details>
<details>
  <summary>weather</summary>

### ➡️ `weather`

This command fetches the current weather conditions for a specified location using the OpenWeatherMap API. This command can only be used by the bot owner or a sudo user.

---

* **Usage**: `weather <location>`
* **Example**: `weather Nairobi`

</details>
<details>
  <summary>welcome</summary>

### How to Use the Welcome Module

This module automatically greets new members with a customizable, visually appealing welcome card when they join a group.

***

#### The Welcome Card
When a new user joins, the bot will send a message that includes:
* A card-style background.
* The new member's profile picture as a thumbnail (or a random welcome image if the profile picture is unavailable).
* A mention of the new user.
* The group's name.
* Your custom welcome message.
* The new total member count (e.g., `YOU'RE MEMBER: 51/1025`).

To keep the chat clean, the bot will also attempt to delete the previously sent welcome message when a new one is posted.

***

#### Permissions & How to Target Groups

* **Permissions**: All commands can only be used by **group admins** and must be sent in a group chat.
* **Default Targeting**: When an admin uses a command, it will apply to their "default connection" group(s).
* **Specific Targeting**: To manage the welcome message for a different group, include `gp:<target>` in your command, where `<target>` is a group alias or JID.

***

#### Commands

##### ➡️ `wlc` (Set Welcome Message)
This command sets or updates the main body of the welcome message for the target group(s). The greeting and member count are added automatically.

* **Syntax**:
    The command `wlc` should be on the first line, and your custom message should follow on the subsequent lines.

* **Example (for default connection)**:
    ```
    wlc
    Please read the group rules in the description.
    We look forward to your participation!
    ```

* **Example (for a specific group)**:
    ```
    wlc
    This is the welcome message for the dev team.
    gp:dev_team_alias
    ```

---

##### ➡️ `delwlc` (Delete Welcome Message)
This command deletes the welcome message configuration for the target group(s), effectively disabling the welcome feature for them.

* **Usage (for default connection)**: `delwlc`
* **Usage (for a specific group)**: `delwlc gp:my_other_group`

</details>

<details>
<summary>update</summary>
### make your bot up to date with latest features

---
 - To see if there is an update

```bash
update
```
 - To update the bot

```bash
update now
```

</details>

<details>
<summary>Termux</summary>

> install termux using command
---

```bash
termux
```
</details>


<details>
  <summary>New features</summary>

### Coming soon ...

🚀 Exciting New Features on the Horizon!

We're constantly working to make your experience even better. Here's a glimpse of what's coming soon...

✨ Upcoming Enhancements

- Smart Automation - Workflows that learn from your patterns
- Advanced Search - Find anything in seconds
- download yt music

---

 - 💫 Stay Tuned!

 - ⭐ Star our repository for updates

---

"The best way to predict the future is to create it." 

Thank you for being part of our journey! 🌟
</details>


</details>

___

[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://t.me/TheCarlTech)
