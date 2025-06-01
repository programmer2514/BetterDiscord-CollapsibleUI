# CollapsibleUI Patch Notes

### v12.2.3:
* Fixed user profile compatibility issue with FullscreenToggle plugin

### v12.2.2:
* Fixed leftover spacing when collapsing button groups

### v12.2.1:
* Fixed a tiny visual inconsistency

### v12.2.0:
* Added UIRefreshRefresh compatibility
* Fixed visual glitch when collapsing forum popout

### v12.1.1:
* Prevented hiding members list/user profile buttons while they are collapsed
* Fixed crash when trying to collapse all toolbar buttons
* Fixed size collapse not working on some elements
* Fixed several minor styling issues

### v12.1.0:
* Fixed for latest Discord version
* Fixed user settings overlapping user profile picture when channel list is collapsed
* Fixed Horizontal Server List compatibility
* Removed static class references

### v12.0.0:
* Updated to work with Discord UI refresh (no longer works on old Discord UI)
* Fixed call container buttons being cut off when window is too small
* More visual tweaks for UI consistency
* Removed obsolete advanced settings

### v11.0.2:
* Added FullscreenToggle compatibility

### v11.0.1:
* Fixed cut-off Message Input on some themes
* Fixed Message Input buttons not being spaced correctly with send message button enabled
* Fixed emoji suggestions not showing in Message Input
* Fixed incorrect Members List styling
* Fixed Channel List offset while in fullscreen calls
* Fixed incompatibility with GameActivityToggle and InvisibleTyping
* Fixed numerical settings being incorrectly stored as strings

### v11.0.0:
* Completely re-wrote plugin from the ground up for performance and stability
* Greatly increased plugin\'s overall performance
* Greatly decreased plugin\'s size on disk
* Switched away from direct DOM manipulation wherever possible
* Refactored style routines to reduce reliance on MutationObservers
* Plugin now caches styles, settings, and webpack modules to decrease load times
* Settings update routines have been changed to reduce the number of disk writes
* Keyboard shortcuts can now be whatever you want and are not limited to standard patterns
* Size Collapse has been rewritten using media queries and now does not affect button states
* Expand on Hover is no longer a requirement for Size Collapse (though it is still recommended)
* Resizable panels can now be resized by clicking-and-dragging anywhere on the edge of the panel
* The activities panel, search panel, and forum popout can now be resized and collapsed
* The floating panels setting has been reworked for increased customizability
* Message bar is now capable of floating above other UI elements
* Improved out-of-the-box compatibility with other plugins and themes
* Hovered panels will no longer collapse while a right-click/popup menu is open
* Removed locale labels other than English due to inaccurate translations
* Moved Unread DMs Badge feature to its own plugin
* Updated settings layout and added several new options
* Several visual tweaks for UI consistency
* Fixed showing multiple update notifications if plugin is toggled without reloading Discord
* Fixed inconsistent Size Collapse when snapping window dimensions in Windows
* Fixed panels jumping open during transitions on some low-end devices
* Fixed forum popup resizing inconsistently with other UI elements

### v10.0.1:
* Fixed settings failing to apply immediately when set

### v10.0.0:
* Added the ability to resize the search panel
* Added the ability to resize the forum popout
* Fixed boolean settings being stored as strings
* Fixed server voice channel being detected as call window
* Fixed forum channels being cut off when channel/members lists are resized too wide

### v9.1.4:
* Switched to BdApi for stylesheet handling
* Fixed profile effects and empty members list displaying backwards
* Improved compatibility with DateViewer, MemberCount, and HorizontalServerList

### v9.1.3:
* Fixed profile panel failing to collapse on latest Discord update

### v9.1.2:
* Fixed plugin failing to load when profile panel is unloaded

### v9.1.1:
* Hotfix for newest Discord release
* Fix for ImageUtilities compatibility

### v9.1.0:
* Fix for newest Discord release (breaks plugin on Discord versions <360320)
* Message bar no longer collapses when uploading attachments or using the emoji picker

### v9.0.2:
* Fixed plugin crashing on MacOS
* Fixed plugin failing to load in forum channels
* Added Quests compatibility

### v9.0.0:
* Plugin no longer depends on ZeresPluginLibrary
* Greatly increased robustness against breaking with Discord updates
* Reworked plugin settings and changed defaults
* Decreased plugin size and increased runtime speed
* Updated translations for increased accuracy and consistency
* Added compatibility for MemberCount and CompleteTimestamps
* Fixed channel list failing to collapse/resize
* Fixed VC buttons shrinking when channel list is resized

### v8.5.0:
* Fixed profile panel and settings buttons on latest update
* Fixed plugin failing to load in thread channels

### v8.4.9:
* Fixed Members List occasionally reversing itself

### v8.4.8:
* Hotfix for newest Discord release (breaks plugin on Discord versions <325120)

### v8.4.7:
* Fixed grey bar at bottom of screen when zooming out in a fullscreen/server call

### v8.4.6:
* Hotfix for newest Discord release (breaks plugin on Discord versions <322979)

### v8.4.5:
* Hotfix for newest Discord release (breaks plugin on Discord versions <317617)

### v8.4.4:
* Hotfix for newest Discord release (breaks plugin on Discord versions <315866)

### v8.4.3:
* Fixed unnecessary console spam
* Updated outdated code

### v8.4.2:
* Fixed dynamically uncollapsed elements collapsing when switching servers/channels
* Fixed profile panel briefly jumping open when switching DMs

### v8.4.1:
* Hotfix for newest Discord release (breaks plugin on Discord versions <309513)

### v8.4.0:
* Hotfix for newest Discord release (breaks plugin on Discord versions <304187)
* Fixed some elements of new profiles being shown reversed
* Fixed call container not filling available space while in fullscreen
* Standardized code formatting using ESLint + Stylistic
* Updated deprecated code

### v8.3.2:
* Fixed cut-off message bar buttons in discord PTB and Canary

### v8.3.1:
* Fixed broken user profile button in latest Discord update

### v8.3.0:
* Hotfix for newest Discord release (breaks plugin on Discord versions <279687)

### v8.2.0:
* Updated Russian translation - Thank you @vanja-san
* Fixed plugin not working in forum channels
* Patched a Discord bug with forum channels being cut off by Members List
* Minor code changes

### v8.1.2:
* Hopefully fixed (or at least improved) Members List briefly jumping open on channel switch
* More performance improvements

### v8.1.1:
* Fixed floating Server List not properly filling vertical space

### v8.1.0:
* Fix for even more Discord class/element changes
* The persistent DM badge is now disabled by default
* Fixed Members List offset issue when UI transitions are disabled
* Improved load times and removed unnecessary resource utilization
* Floating Dynamic Uncollapse will now be disabled if Collapsed Element Distance is not equal to 0

### v8.0.0:
* Fix for more Discord class/element changes
* Fixed elements occasionally collapsing on scroll
* Made User Profile panel resizable
* Updated plugin icons to match Discord's new theme more closely
* Made uncollapsed elements float instead of shifting other elements over
* Added a persistent badge in the top-left showing a total of unread DMs

### v7.4.2: 
* Fix for recent Discord sweeping classes/elements changes

### v7.4.1:
* Hotfix for newest Discord release (breaks plugin on Discord versions <238110)
* Fixed Call Container button appearing when it shouldn\'t
* Improved compatibility with certain themes

### v7.4.0:
* Updated to support newest Discord release (breaks plugin on Discord versions <237546)
* Bumped settings version and cleaned up old JSON
* Fixed Members List not resizing correctly in GCs
* Fixed broken transitions
* Added DateViewer compatibility

### v7.3.0:
* Fixed dynamic handling of user profile popout
* Made members list resizable
* Reformatted plugin code

### v7.2.4:
* Fixed plugin reloading when user presses shift while hovering the mouse over certain messages
* Updated classes to work with the new themed user profiles

### v7.2.3:
* Fixed plugin occasionally failing to reload when switching channels/accounts
* Clarified autocollapse dependencies

### v7.2.2:
* Fixed residual styles on message bar buttons on plugin termination/reload
* Added donation links

### v7.2.1:
* Reworked code formatting to reduce size and increase readability

### v7.2.0:
* Added a fudge factor to collapsible button panels (should decrease jitter)
* Introduced additional advanced settings to control the message bar buttons
* Collapsible button panels are now bound to dynamic uncollapse and its corresponding constraints

### v7.1.2:
* Added an outdated plugin warning for future updates

### v7.1.1:
* Made message bar buttons collapsible

### v7.1.0:
* Fixed plugin crashing Discord when the inspect tool is opened
* Updated to support newest Discord release (breaks plugin on Discord versions <177136)

### v7.0.6:
* Removed unnecessary channel resize handle due to buggy rendering
* Fixed channel list with a custom width stuttering when switching channels
* Improved responsiveness of channel list resizing

### v7.0.5:
* Fixed unnecessary blank space in server call area

### v7.0.4:
* Fixed call area not maintaining custom size when switching between channels
* Fixed channel list expanding unexpectedly on UI refresh if set to a custom width

### v7.0.3:
* Fixed message bar autocollapsing when it is not supposed to

### v7.0.2:
* Prevented message bar autocollapsing while user is actively typing a message

### v7.0.1:
* Fixed full toolbar autocollapse functionality

### v7.0.0
* Added full support for User Profile popout
* Completely refactored all plugin code

### v6.6.1:
* Tweaked user profile toolbar icon
* Fixed yet another BDFDB incompatibility issue

### v6.6.0:
* Separated collapsed states of members list and user profile
* Clarified several settings options
* Changed plugin startup method to work with Canary
* Fixed plugin not loading immediately when first enabled

### v6.5.2:
* Fixed several overflow errors with user area and channel list

### v6.5.1:
* Fixed minor issues with User Profile panel
* Prevented plugin rarely making server list completely inaccessible
* Removed accidental console spam
* Condensed changelog to save space

### v6.5.0:
* Added support for the new User Profile panel

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
