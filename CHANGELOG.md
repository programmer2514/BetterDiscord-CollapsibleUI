# CollapsibleUI Patch Notes

### v6.4.2:
* Improved plugin persistence (again)
* Fixed SplitLargeMessages incompatibility
* Cleaned up and refactored some code

### v6.4.1:
* Cleaned up method of getting plugin instance
* Fixed scrollbar issue when collapsing user area
* Reworked method for removing Discord's default Members List button

### v6.4.0:
* Reduced number of mutationObservers
* Changed plugin persistence algorithm (should be much more consistent)
* Compatibility fix for ServerFolders
* Introduced new conditional autocollapse option
* Removed several "magic numbers" to improve code readability

### v6.3.2:
* Fixed members list not collapsing after a message search

### v6.3.1:
* Fixed patch notes

### v6.3.0:
* Fixed channel list margin remaining in fullscreen mode
* Fixed Members List button functionality in forum channels
* Fixed rare issue where tooltips would get stuck open
* Increased fidelity of toolbar insertion
* Overhauled dynamic uncollapse settings (reset dynamic uncollapse distance)

### v6.2.0:
* Fixed resizable channel list on latest update
* Fixed plugin failing to load on initial app startup
* Prevented members list from auto-collapsing when user popout is open

### v6.1.3:
* Fixed settings buttons not collapsing when a non-focused user sends a DM
* Removed some pointless console spam

### v6.1.2:
* Fixed keyboard shortcuts messing with non-english keyboard layouts

### v6.1.1:
* Fixed several issues introduced in v6.1.0
* Rewrote toolbar insertion code to play better with other plugins
* Fixed BDFDB updates causing plugin to break
* Added support for new Discord forum layout

### v6.1.0:
* Replaced all intervals with mutation observers
* Removed reliance on ZeresPluginLibrary logger modification
* Changed inefficient startup behavior
* Fixed crash caused by BDFDB's stupidity
* Plugin should now comply with updated code guidelines

### v6.0.1:
* Minor tweaks to code and plugin description

### v6.0.0:
* Added customizable keybinds to all actions
* Added ability to auto-collapse elements based on size of Discord window
* Added better compatibility with DevilBro's plugins
* Greatly increased plugin persistence
* Fixed plugin not starting after another plugin is updated
* Significantly refactored code for better modularity
* Removed unnecessary plugin reloading when changing settings
* Removed unnecessary console clutter

### v5.7.2:
* Fixed HSL integration

### v5.7.1:
* Decreased initial plugin loading time
* Fixed incorrect logic causing elements to not remain collapsed

### v5.7.0:
* Added settings option to change behavior of collapsed elements when their corresponding button is disabled
* Greatly improved plugin loading times and stability

### v5.6.2:
* Fixed plugin not loading during video call/screenshare when chat is hidden

### v5.6.1:
* Improved channel list fix (it actually works now)

### v5.6.0:
* Fixed settings button alignment glitch
* Fixed incorrect handling of disabled toolbar buttons
* Fixed channel list being able to resize beyond window limits

### v5.5.1:
* Tweaked more settings to improve reactability (resets uncollapse distance and delay)
* Clarified and moved a settings option to make it more usable

### v5.5.0:
* Fixed toolbar not initializing while in a call
* Added minimal uncollapse delay, which should improve usability
* Tweaked settings and fixed corruption issue (resets all settings to default)

### v5.4.4:
* Fixed user area misalignment with transitions disabled
* Added ChannelDMs compatibility

### v5.4.3:
* Fixed settings bar alignment glitch

### v5.4.2:
* Fixed visual window bar glitch

### v5.4.1:
* Fixed minor syntax errors

### v5.4.0:
* Added out-of-the-box compatibility and overrides for Dark Matter theme
* Implemented compatibility fix between Dark Matter and Horizontal Server List

### v5.3.0:
* Added additional checks for collapsible objects

### v5.2.4:
* Suppressed false code security errors

### v5.2.3:
* Fixed unintentional console spam

### v5.2.2:
* Fixed incorrect settings indices for Selective Dynamic Uncollapse

### v5.2.1:
* Fixed plugin failing to load if a collapsed element does not exist

### v5.2.0:
* Fixed plugin breaking on GNU/Linux

### v5.1.6:
* Cleaned up code

### v5.1.5:
* Stopped relying on aria labels for tooltips

### v5.1.4:
* Fixed minor security vulnerability with tooltips

### v5.1.3:
* Added KeywordTracker compatibility

### v5.1.2:
* Fixed elements not collapsing when their respective button is hidden

### v5.1.1:
* Reworked toolbar insertion

### v5.1.0:
* Added OldTitleBar compatibility

### v5.0.2:
* Fixed more call container issues

### v5.0.1:
* Fixed call container issues

### v5.0.0:
* Decreased number of writes to the config file
* Fixed plugin animations and events while on a call
* Added ability to reset channel list size to default
* Added ability to selectively enable Dynamic Uncollapse
* Added option to make vanilla Discord toolbar collapsible as well as CollapsibleUI's

### v4.4.2:
* Fixed channel list not collapsing

### v4.4.1:
* Fixed minor channel list styling error

### v4.4.0:
* Made channel list resize state persistent

### v4.3.1:
* Fixed small tooltip error

### v4.3.0:
* Added language localization

### v4.2.0:
* Added new advanced option to leave elements partially uncollapsed

### v4.1.4:
* Fixed collapsing call container hiding the toolbar

### v4.1.3:
* Fixed user area not fully uncollapsing while in a call

### v4.1.2:
* Fixed dynamic enabling of Horizontal Server List
* Added startup/shutdown logging

### v4.1.1:
* Finished implementing Horizontal Server List support
* Default settings tweaks (reset dynamic uncollapse distance)

### v4.1.0:
* Implemented rudimentary Horizontal Server List support

### v4.0.7:
* Used more robust message bar hover detection (fixes some themes)

### v4.0.6:
* Prevented sidebars from uncollapsing while hovering over message bar

### v4.0.5:
* Fixed window bar dynamic uncollapse

### v4.0.4:
* Fixed dynamic uncollapse
* Fixed tooltips not showing

### v4.0.3:
* Fixed settings collapse malfunction when in a voice call
* Disabled call area buttons collapsing via settings collapse

### v4.0.2:
* Fixed UI elements not collapsing on mouse leaving the window

### v4.0.1:
* Fixed patch notes

### v4.0.0:
* Added settings panel
* Small animation tweaks
* Added dynamic uncollapse feature
* Made call container collapsible
* With settings collapse enabled, now collapses call area buttons correctly
* Fixed a lot of bugs

### v3.0.1:
* Fixed BetterDiscord repo integration

### v3.0.0:
* Added GNU/Linux support
* Added theme support
* Added thread support
* Made channel list resizable
* Added collapsible button panel feature
* Added settings options in JSON file for advanced tweaking
* Fixed styles on new Discord update
* Fixed many, many bugs

### v2.1.1:
* Fixed plugin auto-update

### v2.1.0:
* Added ZeresPluginLibrary support

### v2.0.1:
* Adjusted some pixel measurements to prevent cutting off the message bar while typing multiline messages

### v2.0.0:
* Added a button to collapse the window title bar
* Updated the button icons to be more consistent
* Finished adding transitions to collapsible elements
* Fixed issues with persistent button states
* Actually fixed plugin crashing on reload
* Fixed handling of plugin being disabled

### v1.2.1:
* Improved support for non-english locales
* Improved handling of missing config

### v1.2.0:
* Added a button to collapse the message bar
* Added transitions to some elements

### v1.1.0:
* Added persistent button states
* Fixed plugin crashing on reload

### v1.0.0:
* Initial release
