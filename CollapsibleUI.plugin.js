/**
 * @name CollapsibleUI
 * @author programmer2514
 * @authorId 563652755814875146
 * @description A feature-rich BetterDiscord plugin that reworks the Discord UI to be significantly more modular
 * @version 11.0.0
 * @donate https://ko-fi.com/benjaminpryor
 * @patreon https://www.patreon.com/BenjaminPryor
 * @website https://github.com/programmer2514/BetterDiscord-CollapsibleUI
 * @source https://github.com/programmer2514/BetterDiscord-CollapsibleUI/raw/refs/heads/main/CollapsibleUI.plugin.js
 */

// Abstract settings calls
const settings = {
  get transitionSpeed() { return this._transitionSpeed ?? (this._transitionSpeed = runtime.api.Data.load('transition-speed') ?? 200); },
  set transitionSpeed(v) { runtime.api.Data.save('transition-speed', this._transitionSpeed = v); },

  get collapseToolbar() { return this._collapseToolbar ?? (this._collapseToolbar = runtime.api.Data.load('collapse-toolbar') ?? 'cui'); },
  set collapseToolbar(v) { runtime.api.Data.save('collapse-toolbar', this._collapseToolbar = v); },

  get collapseSettings() { return this._collapseSettings ?? (this._collapseSettings = runtime.api.Data.load('collapse-settings') ?? true); },
  set collapseSettings(v) { runtime.api.Data.save('collapse-settings', this._collapseSettings = v); },

  get messageInputCollapse() { return this._messageInputCollapse ?? (this._messageInputCollapse = runtime.api.Data.load('message-input-collapse') ?? true); },
  set messageInputCollapse(v) { runtime.api.Data.save('message-input-collapse', this._messageInputCollapse = v); },

  get keyboardShortcuts() { return this._keyboardShortcuts ?? (this._keyboardShortcuts = runtime.api.Data.load('keyboard-shortcuts') ?? true); },
  set keyboardShortcuts(v) { runtime.api.Data.save('keyboard-shortcuts', this._keyboardShortcuts = v); },

  get shortcutList() {
    if (!this._shortcutList) {
      let shortcuts = runtime.api.Data.load('shortcut-list') ?? [['Alt', 's'], ['Alt', 'c'], ['Alt', 'm'], ['Alt', 'p'], ['Alt', 'i'], ['Alt', 'w'], ['Alt', 'v'], ['Alt', 'u'], ['Alt', 'q'], ['Alt', 'f'], ['Alt', 'a']];
      this._shortcutList = [
        new Set(shortcuts[0]),
        new Set(shortcuts[1]),
        new Set(shortcuts[2]),
        new Set(shortcuts[3]),
        new Set(shortcuts[4]),
        new Set(shortcuts[5]),
        new Set(shortcuts[6]),
        new Set(shortcuts[7]),
        new Set(shortcuts[8]),
        new Set(shortcuts[9]),
        new Set(shortcuts[10]),
      ];
    }
    return this._shortcutList;
  },
  set shortcutList(v) {
    runtime.api.Data.save('shortcut-list', v);
    this._shortcutList = [
      new Set(v[0]),
      new Set(v[1]),
      new Set(v[2]),
      new Set(v[3]),
      new Set(v[4]),
      new Set(v[5]),
      new Set(v[6]),
      new Set(v[7]),
      new Set(v[8]),
      new Set(v[9]),
      new Set(v[10]),
    ];
  },

  get collapseDisabledButtons() { return this._collapseDisabledButtons ?? (this._collapseDisabledButtons = runtime.api.Data.load('collapse-disabled-buttons') ?? false); },
  set collapseDisabledButtons(v) { runtime.api.Data.save('collapse-disabled-buttons', this._collapseDisabledButtons = v); },

  get buttonIndexes() { return this._buttonIndexes ?? (this._buttonIndexes = runtime.api.Data.load('button-indexes') ?? [1, 2, 4, 5, 3, 0, 9, 0, 6, 7, 8]); },
  set buttonIndexes(v) { runtime.api.Data.save('button-indexes', this._buttonIndexes = v); },

  get floatingPanels() { return this._floatingPanels ?? (this._floatingPanels = runtime.api.Data.load('floating-panels') ?? true); },
  set floatingPanels(v) { runtime.api.Data.save('floating-panels', this._floatingPanels = v); },

  get floatingEnabled() { return this._floatingEnabled ?? (this._floatingEnabled = runtime.api.Data.load('floating-enabled') ?? ['hover', 'hover', 'hover', 'hover', 'hover', 'hover', null, null, 'hover', 'hover', 'hover']); },
  set floatingEnabled(v) { runtime.api.Data.save('floating-enabled', this._floatingEnabled = v); },

  get expandOnHover() { return this._expandOnHover ?? (this._expandOnHover = runtime.api.Data.load('expand-on-hover') ?? true); },
  set expandOnHover(v) { runtime.api.Data.save('expand-on-hover', this._expandOnHover = v); },

  get expandOnHoverEnabled() { return this._expandOnHoverEnabled ?? (this._expandOnHoverEnabled = runtime.api.Data.load('expand-on-hover-enabled') ?? [true, true, true, true, true, true, true, true, true, true, true]); },
  set expandOnHoverEnabled(v) { runtime.api.Data.save('expand-on-hover-enabled', this._expandOnHoverEnabled = v); },

  get sizeCollapse() { return this._sizeCollapse ?? (this._sizeCollapse = runtime.api.Data.load('size-collapse') ?? false); },
  set sizeCollapse(v) { runtime.api.Data.save('size-collapse', this._sizeCollapse = v); },

  get sizeCollapseThreshold() { return this._sizeCollapseThreshold ?? (this._sizeCollapseThreshold = runtime.api.Data.load('size-collapse-threshold') ?? [500, 600, 950, 1200, 400, 200, 550, 400, 950, 950, 950]); },
  set sizeCollapseThreshold(v) { runtime.api.Data.save('size-collapse-threshold', this._sizeCollapseThreshold = v); },

  get conditionalCollapse() { return this._conditionalCollapse ?? (this._conditionalCollapse = runtime.api.Data.load('conditional-collapse') ?? false); },
  set conditionalCollapse(v) { runtime.api.Data.save('conditional-collapse', this._conditionalCollapse = v); },

  get collapseConditionals() { return this._collapseConditionals ?? (this._collapseConditionals = runtime.api.Data.load('collapse-conditionals') ?? ['', '', '', '', '', '', '', '', '', '', '']); },
  set collapseConditionals(v) { runtime.api.Data.save('collapse-conditionals', this._collapseConditionals = v); },

  get collapseSize() { return this._collapseSize ?? (this._collapseSize = runtime.api.Data.load('collapse-size') ?? 0); },
  set collapseSize(v) { runtime.api.Data.save('collapse-size', this._collapseSize = v); },

  get buttonCollapseFudgeFactor() { return this._buttonCollapseFudgeFactor ?? (this._buttonCollapseFudgeFactor = runtime.api.Data.load('button-collapse-fudge-factor') ?? 10); },
  set buttonCollapseFudgeFactor(v) { runtime.api.Data.save('button-collapse-fudge-factor', this._buttonCollapseFudgeFactor = v); },

  get expandOnHoverFudgeFactor() { return this._expandOnHoverFudgeFactor ?? (this._expandOnHoverFudgeFactor = runtime.api.Data.load('expand-on-hover-fudge-factor') ?? 30); },
  set expandOnHoverFudgeFactor(v) { runtime.api.Data.save('expand-on-hover-fudge-factor', this._expandOnHoverFudgeFactor = v); },

  get messageInputButtonWidth() { return this._messageInputButtonWidth ?? (this._messageInputButtonWidth = runtime.api.Data.load('message-input-button-width') ?? 40); },
  set messageInputButtonWidth(v) { runtime.api.Data.save('message-input-button-width', this._messageInputButtonWidth = v); },

  get toolbarElementMaxWidth() { return this._toolbarElementMaxWidth ?? (this._toolbarElementMaxWidth = runtime.api.Data.load('toolbar-element-max-width') ?? 400); },
  set toolbarElementMaxWidth(v) { runtime.api.Data.save('toolbar-element-max-width', this._toolbarElementMaxWidth = v); },

  get userAreaMaxHeight() { return this._userAreaMaxHeight ?? (this._userAreaMaxHeight = runtime.api.Data.load('user-area-max-height') ?? 420); },
  set userAreaMaxHeight(v) { runtime.api.Data.save('user-area-max-height', this._userAreaMaxHeight = v); },

  get windowBarHeight() { return this._windowBarHeight ?? (this._windowBarHeight = runtime.api.Data.load('window-bar-height') ?? 18); },
  set windowBarHeight(v) { runtime.api.Data.save('window-bar-height', this._windowBarHeight = v); },

  get windowBarMarginTop() { return this._windowBarMarginTop ?? (this._windowBarMarginTop = runtime.api.Data.load('window-bar-margin-top') ?? 4); },
  set windowBarMarginTop(v) { runtime.api.Data.save('window-bar-margin-top', this._windowBarMarginTop = v); },

  get toolbarHeight() { return this._toolbarHeight ?? (this._toolbarHeight = runtime.api.Data.load('toolbar-height') ?? 48); },
  set toolbarHeight(v) { runtime.api.Data.save('toolbar-height', this._toolbarHeight = v); },

  get serverListWidth() { return this._serverListWidth ?? (this._serverListWidth = runtime.api.Data.load('server-list-width') ?? 72); },
  set serverListWidth(v) { runtime.api.Data.save('server-list-width', this._serverListWidth = v); },

  get buttonsActive() { return this._buttonsActive ?? (this._buttonsActive = runtime.api.Data.load('buttons-active') ?? [true, true, true, true, true, true, true, true, true, true, true]); },
  set buttonsActive(v) { runtime.api.Data.save('buttons-active', this._buttonsActive = v); },

  get channelListWidth() { return this._channelListWidth ?? (this._channelListWidth = runtime.api.Data.load('channel-list-width') ?? 240); },
  set channelListWidth(v) { runtime.api.Data.save('channel-list-width', this._channelListWidth = v); },

  get membersListWidth() { return this._membersListWidth ?? (this._membersListWidth = runtime.api.Data.load('members-list-width') ?? 240); },
  set membersListWidth(v) { runtime.api.Data.save('members-list-width', this._membersListWidth = v); },

  get userProfileWidth() { return this._userProfileWidth ?? (this._userProfileWidth = runtime.api.Data.load('user-profile-width') ?? 340); },
  set userProfileWidth(v) { runtime.api.Data.save('user-profile-width', this._userProfileWidth = v); },

  get searchPanelWidth() { return this._searchPanelWidth ?? (this._searchPanelWidth = runtime.api.Data.load('search-panel-width') ?? 418); },
  set searchPanelWidth(v) { runtime.api.Data.save('search-panel-width', this._searchPanelWidth = v); },

  get forumPopoutWidth() { return this._forumPopoutWidth ?? (this._forumPopoutWidth = runtime.api.Data.load('forum-popout-width') ?? 450); },
  set forumPopoutWidth(v) { runtime.api.Data.save('forum-popout-width', this._forumPopoutWidth = v); },

  get activityPanelWidth() { return this._activityPanelWidth ?? (this._activityPanelWidth = runtime.api.Data.load('activity-panel-width') ?? 360); },
  set activityPanelWidth(v) { runtime.api.Data.save('activity-panel-width', this._activityPanelWidth = v); },

  get defaultChannelListWidth() { return this._defaultChannelListWidth ?? (this._defaultChannelListWidth = runtime.api.Data.load('default-channel-list-width') ?? 240); },
  set defaultChannelListWidth(v) { runtime.api.Data.save('default-channel-list-width', this._defaultChannelListWidth = v); },

  get defaultMembersListWidth() { return this._defaultMembersListWidth ?? (this._defaultMembersListWidth = runtime.api.Data.load('default-members-list-width') ?? 240); },
  set defaultMembersListWidth(v) { runtime.api.Data.save('default-members-list-width', this._defaultMembersListWidth = v); },

  get defaultUserProfileWidth() { return this._defaultUserProfileWidth ?? (this._defaultUserProfileWidth = runtime.api.Data.load('default-user-profile-width') ?? 340); },
  set defaultUserProfileWidth(v) { runtime.api.Data.save('default-user-profile-width', this._defaultUserProfileWidth = v); },

  get defaultSearchPanelWidth() { return this._defaultSearchPanelWidth ?? (this._defaultSearchPanelWidth = runtime.api.Data.load('default-search-panel-width') ?? 418); },
  set defaultSearchPanelWidth(v) { runtime.api.Data.save('default-search-panel-width', this._defaultSearchPanelWidth = v); },

  get defaultForumPopoutWidth() { return this._defaultForumPopoutWidth ?? (this._defaultForumPopoutWidth = runtime.api.Data.load('default-forum-popout-width') ?? 450); },
  set defaultForumPopoutWidth(v) { runtime.api.Data.save('default-forum-popout-width', this._defaultForumPopoutWidth = v); },

  get defaultActivityPanelWidth() { return this._defaultActivityPanelWidth ?? (this._defaultActivityPanelWidth = runtime.api.Data.load('default-activity-panel-width') ?? 360); },
  set defaultActivityPanelWidth(v) { runtime.api.Data.save('default-activity-panel-width', this._defaultActivityPanelWidth = v); },
};

// Define plugin changelog and settings panel layout
const config = {
  changelog: [
    {
      title: '11.0.0',
      type: 'added',
      items: [
        'Completely re-wrote plugin from the ground up for performance and stability',
        'Greatly increased plugin\'s overall performance',
        'Greatly decreased plugin\'s size on disk',
        'Switched away from direct DOM manipulation wherever possible',
        'Refactored style routines to reduce reliance on MutationObservers',
        'Plugin now caches styles, settings, and webpack modules to decrease load times',
        'Settings update routines have been changed to reduce the number of disk writes',
        'Keyboard shortcuts can now be whatever you want and are not limited to standard patterns',
        'Size Collapse has been rewritten using media queries and now does not affect button states',
        'Expand on Hover is no longer a requirement for Size Collapse (though it is still recommended)',
        'Resizable panels can now be resized by clicking-and-dragging anywhere on the edge of the panel',
        'The activities panel, search panel, and forum popout can now be resized and collapsed',
        'The floating panels setting has been reworked for increased customizability',
        'Message bar is now capable of floating above other UI elements',
        'Improved out-of-the-box compatibility with other plugins and themes',
        'Hovered panels will no longer collapse while a right-click/popup menu is open',
        'Removed locale labels other than English due to inaccurate translations',
        'Moved Unread DMs Badge feature to its own plugin',
        'Updated settings layout and added several new options',
        'Several visual tweaks for UI consistency',
        'Fixed showing multiple update notifications if plugin is toggled without reloading Discord',
        'Fixed inconsistent Size Collapse when snapping window dimensions in Windows',
        'Fixed panels jumping open during transitions on some low-end devices',
        'Fixed forum popup resizing inconsistently with other UI elements',
        'RE-WRITE MAY INTRODUCE REGRESSIONS - PLEASE REPORT ANY NEW ISSUES VIA GITHUB',
        'IF YOU WOULD LIKE TO CONTRIBUTE A TRANSLATION FOR THIS PLUGIN, PLEASE OPEN A PULL REQUEST ON GITHUB',
      ],
    },
    {
      title: '1.0.0 - 10.0.1',
      type: 'added',
      items: [
        'See the full changelog here: https://programmer2514.github.io/?l=cui-changelog',
      ],
    },
  ],
  settings: [
    {
      type: 'category',
      id: 'main-group',
      name: 'Main',
      collapsible: true,
      shown: true,
      settings: [
        {
          type: 'number',
          id: 'transitionSpeed',
          name: 'UI Transition Speed (ms)',
          note: 'Sets the speed of UI animations. Set to 0 to disable transitions',
          get value() { return settings.transitionSpeed; },
        },
        {
          type: 'dropdown',
          id: 'collapseToolbar',
          name: 'Collapse Toolbar Buttons',
          note: 'Automatically collapse the top-right toolbar buttons',
          get value() { return settings.collapseToolbar; },
          options: [
            {
              label: 'None',
              value: false,
            },
            {
              label: 'Just CollapsibleUI',
              value: 'cui',
            },
            {
              label: 'All',
              value: 'all',
            },
          ],
        },
        {
          type: 'switch',
          id: 'collapseSettings',
          name: 'Collapse Settings',
          note: 'Automatically collapse the bottom-left settings buttons',
          get value() { return settings.collapseSettings; },
        },
        {
          type: 'switch',
          id: 'messageInputCollapse',
          name: 'Collapse Message Input Buttons',
          note: 'Automatically collapse the GIF/sticker/emoji/gift buttons',
          get value() { return settings.messageInputCollapse; },
        },
      ],
    },
    {
      type: 'category',
      id: 'keyboard-shortcuts-group',
      name: 'Keyboard Shortcuts',
      collapsible: true,
      shown: false,
      settings: [
        {
          type: 'switch',
          id: 'keyboardShortcuts',
          name: 'Keyboard Shortcuts',
          note: 'Collapse UI panels using keyboard shortcuts',
          get value() { return settings.keyboardShortcuts; },
        },
        {
          type: 'keybind',
          id: 'server-list-shortcut',
          name: 'Toggle Server List',
          get value() { return [...settings.shortcutList[constants.I_SERVER_LIST]]; },
        },
        {
          type: 'keybind',
          id: 'channel-list-shortcut',
          name: 'Toggle Channel List',
          get value() { return [...settings.shortcutList[constants.I_CHANNEL_LIST]]; },
        },
        {
          type: 'keybind',
          id: 'members-list-shortcut',
          name: 'Toggle Members List',
          get value() { return [...settings.shortcutList[constants.I_MEMBERS_LIST]]; },
        },
        {
          type: 'keybind',
          id: 'user-profile-shortcut',
          name: 'Toggle User Profile',
          get value() { return [...settings.shortcutList[constants.I_USER_PROFILE]]; },
        },
        {
          type: 'keybind',
          id: 'message-input-shortcut',
          name: 'Toggle Message Input',
          get value() { return [...settings.shortcutList[constants.I_MESSAGE_INPUT]]; },
        },
        {
          type: 'keybind',
          id: 'window-bar-shortcut',
          name: 'Toggle Window Bar',
          get value() { return [...settings.shortcutList[constants.I_WINDOW_BAR]]; },
        },
        {
          type: 'keybind',
          id: 'call-window-shortcut',
          name: 'Toggle Call Window',
          get value() { return [...settings.shortcutList[constants.I_CALL_WINDOW]]; },
        },
        {
          type: 'keybind',
          id: 'user-area-shortcut',
          name: 'Toggle User Area',
          get value() { return [...settings.shortcutList[constants.I_USER_AREA]]; },
        },
        {
          type: 'keybind',
          id: 'search-panel-shortcut',
          name: 'Toggle Search Panel',
          get value() { return [...settings.shortcutList[constants.I_SEARCH_PANEL]]; },
        },
        {
          type: 'keybind',
          id: 'forum-popout-shortcut',
          name: 'Toggle Forum Popout',
          get value() { return [...settings.shortcutList[constants.I_FORUM_POPOUT]]; },
        },
        {
          type: 'keybind',
          id: 'activity-panel-shortcut',
          name: 'Toggle Activity Panel',
          get value() { return [...settings.shortcutList[constants.I_ACTIVITY_PANEL]]; },
        },
      ],
    },
    {
      type: 'category',
      id: 'toolbar-buttons-group',
      name: 'Toolbar Buttons',
      collapsible: true,
      shown: false,
      settings: [
        {
          type: 'switch',
          id: 'collapseDisabledButtons',
          name: 'Disabled Buttons Stay Collapsed?',
          note: 'Panels with disabled toggle buttons will keep their toggled state. If disabled, they will default to open',
          get value() { return settings.collapseDisabledButtons; },
        },
        {
          type: 'slider',
          id: 'server-list-button-index',
          name: 'Server List Button',
          note: 'Sets the order of the Server List toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_SERVER_LIST]; },
          min: 0,
          max: 11,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
        {
          type: 'slider',
          id: 'channel-list-button-index',
          name: 'Channel List Button',
          note: 'Sets the order of the Channel List toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_CHANNEL_LIST]; },
          min: 0,
          max: 11,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
        {
          type: 'slider',
          id: 'members-list-button-index',
          name: 'Members List Button',
          note: 'Sets the order of the Members List toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_MEMBERS_LIST]; },
          min: 0,
          max: 11,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
        {
          type: 'slider',
          id: 'user-profile-button-index',
          name: 'User Profile Button',
          note: 'Sets the order of the User Profile toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_USER_PROFILE]; },
          min: 0,
          max: 11,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
        {
          type: 'slider',
          id: 'message-input-button-index',
          name: 'Message Input Button',
          note: 'Sets the order of the Message Input toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_MESSAGE_INPUT]; },
          min: 0,
          max: 11,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
        {
          type: 'slider',
          id: 'window-bar-button-index',
          name: 'Window Bar Button',
          note: 'Sets the order of the Window Bar toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_WINDOW_BAR]; },
          min: 0,
          max: 11,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
        {
          type: 'slider',
          id: 'call-window-button-index',
          name: 'Call Window Button',
          note: 'Sets the order of the Call Window toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_CALL_WINDOW]; },
          min: 0,
          max: 11,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
        {
          type: 'slider',
          id: 'user-area-button-index',
          name: 'User Area Button',
          note: 'Sets the order of the User Area toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_USER_AREA]; },
          min: 0,
          max: 11,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
        {
          type: 'slider',
          id: 'search-panel-button-index',
          name: 'Search Panel Button',
          note: 'Sets the order of the Search Panel toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_SEARCH_PANEL]; },
          min: 0,
          max: 11,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
        {
          type: 'slider',
          id: 'forum-popout-button-index',
          name: 'Forum Popout Button',
          note: 'Sets the order of the Forum Popout toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_FORUM_POPOUT]; },
          min: 0,
          max: 11,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
        {
          type: 'slider',
          id: 'activity-panel-button-index',
          name: 'Activity Panel Button',
          note: 'Sets the order of the Activity Panel toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_ACTIVITY_PANEL]; },
          min: 0,
          max: 11,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
      ],
    },
    {
      type: 'category',
      id: 'resizable-panels-group',
      name: 'Resizable Panels',
      collapsible: true,
      shown: false,
      settings: [
        {
          type: 'switch',
          id: 'resizable-channel-list',
          name: 'Resizable Channel List',
          note: 'Resize the channel list by clicking-and-dragging right edge. Right-click to reset width',
          get value() { return settings.channelListWidth !== 0; },
        },
        {
          type: 'switch',
          id: 'resizable-members-list',
          name: 'Resizable Members List',
          note: 'Resize the members list by clicking-and-dragging the left edge. Right-click to reset width',
          get value() { return settings.membersListWidth !== 0; },
        },
        {
          type: 'switch',
          id: 'resizable-user-profile',
          name: 'Resizable User Profile',
          note: 'Resize the user profile in DMs by clicking-and-dragging the left edge. Right-click to reset width',
          get value() { return settings.userProfileWidth !== 0; },
        },
        {
          type: 'switch',
          id: 'resizable-search-panel',
          name: 'Resizable Search Panel',
          note: 'Resize the message search panel by clicking-and-dragging the left edge. Right-click to reset width',
          get value() { return settings.searchPanelWidth !== 0; },
        },
        {
          type: 'switch',
          id: 'resizable-forum-popout',
          name: 'Resizable Forum Popout',
          note: 'Resize the thread popup in forum channels by clicking-and-dragging the left edge. Right-click to reset width',
          get value() { return settings.forumPopoutWidth !== 0; },
        },
        {
          type: 'switch',
          id: 'resizable-activity-panel',
          name: 'Resizable Activity Panel',
          note: 'Resize the activity panel in the friends list by clicking-and-dragging the left edge. Right-click to reset width',
          get value() { return settings.activityPanelWidth !== 0; },
        },
      ],
    },
    {
      type: 'category',
      id: 'floating-panels-group',
      name: 'Floating Panels',
      collapsible: true,
      shown: false,
      settings: [
        {
          type: 'switch',
          id: 'floatingPanels',
          name: 'Floating Panels',
          note: 'Expanded UI panels will float over other panels, instead of moving them out of the way',
          get value() { return settings.floatingPanels; },
        },
        {
          type: 'dropdown',
          id: 'server-list-floating',
          name: 'Server List',
          note: 'Server List floats over other panels',
          get value() { return settings.floatingEnabled[constants.I_SERVER_LIST]; },
          options: [
            {
              label: 'Never',
              value: false,
            },
            {
              label: 'On Hover',
              value: 'hover',
            },
            {
              label: 'Always',
              value: 'always',
            },
          ],
        },
        {
          type: 'dropdown',
          id: 'channel-list-floating',
          name: 'Channel List',
          note: 'Channel List floats over other panels',
          get value() { return settings.floatingEnabled[constants.I_CHANNEL_LIST]; },
          options: [
            {
              label: 'Never',
              value: false,
            },
            {
              label: 'On Hover',
              value: 'hover',
            },
            {
              label: 'Always',
              value: 'always',
            },
          ],
        },
        {
          type: 'dropdown',
          id: 'members-list-floating',
          name: 'Members List',
          note: 'Members List floats over other panels',
          get value() { return settings.floatingEnabled[constants.I_MEMBERS_LIST]; },
          options: [
            {
              label: 'Never',
              value: false,
            },
            {
              label: 'On Hover',
              value: 'hover',
            },
            {
              label: 'Always',
              value: 'always',
            },
          ],
        },
        {
          type: 'dropdown',
          id: 'user-profile-floating',
          name: 'User Profile',
          note: 'User Profile floats over other panels',
          get value() { return settings.floatingEnabled[constants.I_USER_PROFILE]; },
          options: [
            {
              label: 'Never',
              value: false,
            },
            {
              label: 'On Hover',
              value: 'hover',
            },
            {
              label: 'Always',
              value: 'always',
            },
          ],
        },
        {
          type: 'dropdown',
          id: 'message-input-floating',
          name: 'Message Input',
          note: 'Message Input floats over other panels',
          get value() { return settings.floatingEnabled[constants.I_MESSAGE_INPUT]; },
          options: [
            {
              label: 'Never',
              value: false,
            },
            {
              label: 'On Hover',
              value: 'hover',
            },
            {
              label: 'Always',
              value: 'always',
            },
          ],
        },
        {
          type: 'dropdown',
          id: 'window-bar-floating',
          name: 'Window Bar',
          note: 'Window Bar floats over other panels',
          get value() { return settings.floatingEnabled[constants.I_WINDOW_BAR]; },
          options: [
            {
              label: 'Never',
              value: false,
            },
            {
              label: 'On Hover',
              value: 'hover',
            },
            {
              label: 'Always',
              value: 'always',
            },
          ],
        },
        {
          type: 'dropdown',
          id: 'search-panel-floating',
          name: 'Search Panel',
          note: 'Search Panel floats over other panels',
          get value() { return settings.floatingEnabled[constants.I_SEARCH_PANEL]; },
          options: [
            {
              label: 'Never',
              value: false,
            },
            {
              label: 'On Hover',
              value: 'hover',
            },
            {
              label: 'Always',
              value: 'always',
            },
          ],
        },
        {
          type: 'dropdown',
          id: 'forum-popout-floating',
          name: 'Forum Popout',
          note: 'Forum Popout floats over other panels',
          get value() { return settings.floatingEnabled[constants.I_FORUM_POPOUT]; },
          options: [
            {
              label: 'Never',
              value: false,
            },
            {
              label: 'On Hover',
              value: 'hover',
            },
            {
              label: 'Always',
              value: 'always',
            },
          ],
        },
        {
          type: 'dropdown',
          id: 'activity-panel-floating',
          name: 'Activity Panel',
          note: 'Activity Panel floats over other panels',
          get value() { return settings.floatingEnabled[constants.I_ACTIVITY_PANEL]; },
          options: [
            {
              label: 'Never',
              value: false,
            },
            {
              label: 'On Hover',
              value: 'hover',
            },
            {
              label: 'Always',
              value: 'always',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      id: 'expand-on-hover-group',
      name: 'Expand on Hover',
      collapsible: true,
      shown: false,
      settings: [
        {
          type: 'switch',
          id: 'expandOnHover',
          name: 'Expand on Hover',
          note: 'Expands collapsed UI panels when the mouse is near them. Must be enabled for conditional/size collapse to work',
          get value() { return settings.expandOnHover; },
        },
        {
          type: 'switch',
          id: 'server-list-expand-on-hover',
          name: 'Server List',
          note: 'Server List expands on hover',
          get value() { return settings.expandOnHoverEnabled[constants.I_SERVER_LIST]; },
        },
        {
          type: 'switch',
          id: 'channel-list-expand-on-hover',
          name: 'Channel List',
          note: 'Channel List expands on hover',
          get value() { return settings.expandOnHoverEnabled[constants.I_CHANNEL_LIST]; },
        },
        {
          type: 'switch',
          id: 'members-list-expand-on-hover',
          name: 'Members List',
          note: 'Members List expands on hover',
          get value() { return settings.expandOnHoverEnabled[constants.I_MEMBERS_LIST]; },
        },
        {
          type: 'switch',
          id: 'user-profile-expand-on-hover',
          name: 'User Profile',
          note: 'User Profile expands on hover',
          get value() { return settings.expandOnHoverEnabled[constants.I_USER_PROFILE]; },
        },
        {
          type: 'switch',
          id: 'message-input-expand-on-hover',
          name: 'Message Input',
          note: 'Message Input expands on hover',
          get value() { return settings.expandOnHoverEnabled[constants.I_MESSAGE_INPUT]; },
        },
        {
          type: 'switch',
          id: 'window-bar-expand-on-hover',
          name: 'Window Bar',
          note: 'Window Bar expands on hover',
          get value() { return settings.expandOnHoverEnabled[constants.I_WINDOW_BAR]; },
        },
        {
          type: 'switch',
          id: 'call-window-expand-on-hover',
          name: 'Call Window',
          note: 'Call Window expands on hover',
          get value() { return settings.expandOnHoverEnabled[constants.I_CALL_WINDOW]; },
        },
        {
          type: 'switch',
          id: 'user-area-expand-on-hover',
          name: 'User Area',
          note: 'User Area expands on hover',
          get value() { return settings.expandOnHoverEnabled[constants.I_USER_AREA]; },
        },
        {
          type: 'switch',
          id: 'search-panel-expand-on-hover',
          name: 'Search Panel',
          note: 'Search Panel expands on hover',
          get value() { return settings.expandOnHoverEnabled[constants.I_SEARCH_PANEL]; },
        },
        {
          type: 'switch',
          id: 'forum-popout-expand-on-hover',
          name: 'Forum Popout',
          note: 'Forum Popout expands on hover',
          get value() { return settings.expandOnHoverEnabled[constants.I_FORUM_POPOUT]; },
        },
        {
          type: 'switch',
          id: 'activity-panel-expand-on-hover',
          name: 'Activity Panel',
          note: 'Activity Panel expands on hover',
          get value() { return settings.expandOnHoverEnabled[constants.I_ACTIVITY_PANEL]; },
        },
      ],
    },
    {
      type: 'category',
      id: 'size-collapse-group',
      name: 'Size Collapse',
      collapsible: true,
      shown: false,
      settings: [
        {
          type: 'switch',
          id: 'sizeCollapse',
          name: 'Size Collapse',
          note: 'Auto-collapse UI panels based on window size',
          get value() { return settings.sizeCollapse; },
        },
        {
          type: 'number',
          id: 'server-list-threshold',
          name: 'Server List - Width Threshold (px)',
          note: 'Window width at which the Server List will collapse. Specifies height if Horizontal Server List is enabled',
          get value() { return settings.sizeCollapseThreshold[constants.I_SERVER_LIST]; },
        },
        {
          type: 'number',
          id: 'channel-list-threshold',
          name: 'Channel List - Width Threshold (px)',
          note: 'Window width at which the Channel List will collapse',
          get value() { return settings.sizeCollapseThreshold[constants.I_CHANNEL_LIST]; },
        },
        {
          type: 'number',
          id: 'members-list-threshold',
          name: 'Members List - Width Threshold (px)',
          note: 'Window width at which the Members List will collapse',
          get value() { return settings.sizeCollapseThreshold[constants.I_MEMBERS_LIST]; },
        },
        {
          type: 'number',
          id: 'user-profile-threshold',
          name: 'User Profile - Width Threshold (px)',
          note: 'Window width at which the User Profile will collapse',
          get value() { return settings.sizeCollapseThreshold[constants.I_USER_PROFILE]; },
        },
        {
          type: 'number',
          id: 'message-input-threshold',
          name: 'Message Input - Height Threshold (px)',
          note: 'Window height at which the Message Input will collapse',
          get value() { return settings.sizeCollapseThreshold[constants.I_MESSAGE_INPUT]; },
        },
        {
          type: 'number',
          id: 'window-bar-threshold',
          name: 'Window Bar - Height Threshold (px)',
          note: 'Window height at which the Window Bar will collapse',
          get value() { return settings.sizeCollapseThreshold[constants.I_WINDOW_BAR]; },
        },
        {
          type: 'number',
          id: 'call-window-threshold',
          name: 'Call Window - Height Threshold (px)',
          note: 'Window height at which the Call Window will collapse',
          get value() { return settings.sizeCollapseThreshold[constants.I_CALL_WINDOW]; },
        },
        {
          type: 'number',
          id: 'user-area-threshold',
          name: 'User Area - Height Threshold (px)',
          note: 'Window height at which the User Area will collapse',
          get value() { return settings.sizeCollapseThreshold[constants.I_USER_AREA]; },
        },
        {
          type: 'number',
          id: 'search-panel-threshold',
          name: 'Search Panel - Width Threshold (px)',
          note: 'Window width at which the Search Panel will collapse',
          get value() { return settings.sizeCollapseThreshold[constants.I_SEARCH_PANEL]; },
        },
        {
          type: 'number',
          id: 'forum-popout-threshold',
          name: 'Forum Popout - Width Threshold (px)',
          note: 'Window width at which the Forum Popout will collapse',
          get value() { return settings.sizeCollapseThreshold[constants.I_FORUM_POPOUT]; },
        },
        {
          type: 'number',
          id: 'activity-panel-threshold',
          name: 'Activity Panel - Width Threshold (px)',
          note: 'Window width at which the Activity Panel will collapse',
          get value() { return settings.sizeCollapseThreshold[constants.I_ACTIVITY_PANEL]; },
        },
      ],
    },
    {
      type: 'category',
      id: 'conditional-collapse-group',
      name: 'Conditional Collapse (Advanced)',
      collapsible: true,
      shown: false,
      settings: [
        {
          type: 'switch',
          id: 'conditionalCollapse',
          name: 'Conditional Collapse',
          note: 'Auto-collapse UI panels based on custom conditional expression. Overrides size collapse',
          get value() { return settings.conditionalCollapse; },
        },
        {
          type: 'text',
          id: 'server-list-conditional',
          name: 'Server List - Collapse Expression (JS)',
          note: 'The Server List will collapse when this expression is true, and expand when it is false',
          get value() { return settings.collapseConditionals[constants.I_SERVER_LIST]; },
        },
        {
          type: 'text',
          id: 'channel-list-conditional',
          name: 'Channel List - Collapse Expression (JS)',
          note: 'The Channel List will collapse when this expression is true, and expand when it is false',
          get value() { return settings.collapseConditionals[constants.I_CHANNEL_LIST]; },
        },
        {
          type: 'text',
          id: 'members-list-conditional',
          name: 'Members List - Collapse Expression (JS)',
          note: 'The Members List will collapse when this expression is true, and expand when it is false',
          get value() { return settings.collapseConditionals[constants.I_MEMBERS_LIST]; },
        },
        {
          type: 'text',
          id: 'user-profile-conditional',
          name: 'User Profile - Collapse Expression (JS)',
          note: 'The User Profile will collapse when this expression is true, and expand when it is false',
          get value() { return settings.collapseConditionals[constants.I_USER_PROFILE]; },
        },
        {
          type: 'text',
          id: 'message-input-conditional',
          name: 'Message Input - Collapse Expression (JS)',
          note: 'The Message Input will collapse when this expression is true, and expand when it is false',
          get value() { return settings.collapseConditionals[constants.I_MESSAGE_INPUT]; },
        },
        {
          type: 'text',
          id: 'window-bar-conditional',
          name: 'Window Bar - Collapse Expression (JS)',
          note: 'The Window Bar will collapse when this expression is true, and expand when it is false',
          get value() { return settings.collapseConditionals[constants.I_WINDOW_BAR]; },
        },
        {
          type: 'text',
          id: 'call-window-conditional',
          name: 'Call Window - Collapse Expression (JS)',
          note: 'The Call Window will collapse when this expression is true, and expand when it is false',
          get value() { return settings.collapseConditionals[constants.I_CALL_WINDOW]; },
        },
        {
          type: 'text',
          id: 'user-area-conditional',
          name: 'User Area - Collapse Expression (JS)',
          note: 'The User Area will collapse when this expression is true, and expand when it is false',
          get value() { return settings.collapseConditionals[constants.I_USER_AREA]; },
        },
        {
          type: 'text',
          id: 'search-panel-conditional',
          name: 'Search Panel - Collapse Expression (JS)',
          note: 'The Search Panel will collapse when this expression is true, and expand when it is false',
          get value() { return settings.collapseConditionals[constants.I_SEARCH_PANEL]; },
        },
        {
          type: 'text',
          id: 'forum-popout-conditional',
          name: 'Forum Popout - Collapse Expression (JS)',
          note: 'The Forum Popout will collapse when this expression is true, and expand when it is false',
          get value() { return settings.collapseConditionals[constants.I_FORUM_POPOUT]; },
        },
        {
          type: 'text',
          id: 'activity-panel-conditional',
          name: 'Activity Panel - Collapse Expression (JS)',
          note: 'The Activity Panel will collapse when this expression is true, and expand when it is false',
          get value() { return settings.collapseConditionals[constants.I_ACTIVITY_PANEL]; },
        },
      ],
    },
    {
      type: 'category',
      id: 'advanced-group',
      name: 'Advanced',
      collapsible: true,
      shown: false,
      settings: [
        {
          type: 'number',
          id: 'collapseSize',
          name: 'Collapsed Panel Size (px)',
          note: 'The size of UI panels when collapsed',
          get value() { return settings.collapseSize; },
        },
        {
          type: 'number',
          id: 'buttonCollapseFudgeFactor',
          name: 'Button Groups - Collapse Fudge Factor (px)',
          note: 'The distance the mouse must be from a set of buttons before they collapse',
          get value() { return settings.buttonCollapseFudgeFactor; },
        },
        {
          type: 'number',
          id: 'expandOnHoverFudgeFactor',
          name: 'Expand on Hover - Fudge Factor (px)',
          note: 'The distance the mouse must be from a UI panel before it expands or collapses',
          get value() { return settings.expandOnHoverFudgeFactor; },
        },
        {
          type: 'number',
          id: 'messageInputButtonWidth',
          name: 'Message Input Button - Width (px)',
          note: 'The width of a message input button when expanded',
          get value() { return settings.messageInputButtonWidth; },
        },
        {
          type: 'number',
          id: 'toolbarElementMaxWidth',
          name: 'Toolbar Elements - Max Width (px)',
          note: 'The maximum width of the full toolbar\'s elements when expanded',
          get value() { return settings.toolbarElementMaxWidth; },
        },
        {
          type: 'number',
          id: 'userAreaMaxHeight',
          name: 'User Area - Max Height (px)',
          note: 'The maximum height of the User Area when expanded',
          get value() { return settings.userAreaMaxHeight; },
        },
        {
          type: 'number',
          id: 'windowBarHeight',
          name: 'Window Bar - Height (px)',
          note: 'The height of the Window Bar when expanded',
          get value() { return settings.windowBarHeight; },
        },
        {
          type: 'number',
          id: 'windowBarMarginTop',
          name: 'Window Bar - Top Margin (px)',
          note: 'The top margin of the Window Bar when expanded',
          get value() { return settings.windowBarMarginTop; },
        },
        {
          type: 'number',
          id: 'toolbarHeight',
          name: 'Toolbar - Height (px)',
          note: 'The height of the toolbar',
          get value() { return settings.toolbarHeight; },
        },
        {
          type: 'number',
          id: 'serverListWidth',
          name: 'Server List - Width (px)',
          note: 'The width of the Server List when expanded',
          get value() { return settings.serverListWidth; },
        },
        {
          type: 'number',
          id: 'defaultChannelListWidth',
          name: 'Channel List - Default Width (px)',
          note: 'The width of the channel list when not actively resized',
          get value() { return settings.defaultChannelListWidth; },
        },
        {
          type: 'number',
          id: 'defaultMembersListWidth',
          name: 'Members List - Default Width (px)',
          note: 'The width of the members list when not actively resized',
          get value() { return settings.defaultMembersListWidth; },
        },
        {
          type: 'number',
          id: 'defaultUserProfileWidth',
          name: 'User Profile - Default Width (px)',
          note: 'The width of the user profile when not actively resized',
          get value() { return settings.defaultUserProfileWidth; },
        },
        {
          type: 'number',
          id: 'defaultSearchPanelWidth',
          name: 'Search Panel - Default Width (px)',
          note: 'The width of the search panel when not actively resized',
          get value() { return settings.defaultSearchPanelWidth; },
        },
        {
          type: 'number',
          id: 'defaultForumPopoutWidth',
          name: 'Forum Popout - Default Width (px)',
          note: 'The width of the forum popout when not actively resized',
          get value() { return settings.defaultForumPopoutWidth; },
        },
        {
          type: 'number',
          id: 'defaultActivityPanelWidth',
          name: 'Activity Panel - Default Width (px)',
          note: 'The width of the activity panel when not actively resized',
          get value() { return settings.defaultActivityPanelWidth; },
        },
      ],
    },
  ],
};

// Define locale labels
const locale = {
  en: [
    'Server List',
    'Channel List',
    'Members List',
    'User Profile',
    'Message Input',
    'Window Bar',
    'Call Window',
    'User Area',
    'Search Panel',
    'Forum Popout',
    'Activity Panel',
  ],
  get current() { return this[document.documentElement.getAttribute('lang')] ?? this.en; },
};

// Define icon paths
const icons = [
  '<path fill="currentColor" d="M18.9,2.5H5.1c-2.3,0-4.1,1.8-4.1,4.1v10.8c0,2.3,1.8,4.1,4.1,4.1h13.8c2.3,0,4.1-1.8,4-4.1V6.6c0-2.3-1.7-4.1-4-4.1ZM21.7,17.4c0,1.5-1.3,2.7-2.8,2.7h-10.5c-1.6,0-2.8-1.2-2.8-2.7V6.6c0-1.5,1.2-2.7,2.8-2.7h10.5c1.5,0,2.8,1.2,2.8,2.7v10.8Z"/>',
  '<path fill="currentColor" d="M4.1,12c0-.9-.6-1.6-1.5-1.6s-1.6.7-1.6,1.6.6,1.6,1.5,1.6,1.6-.7,1.6-1.6Z"/><path fill="currentColor" d="M2.6,16.4c-.9,0-1.6.7-1.6,1.6s.7,1.6,1.6,1.6,1.6-.7,1.6-1.6c-.1-.9-.8-1.6-1.6-1.6Z"/><path fill="currentColor" d="M2.6,4.5c-.9,0-1.6.7-1.6,1.6s.7,1.6,1.6,1.6,1.6-.7,1.6-1.6-.8-1.6-1.6-1.6Z"/><path fill="currentColor" d="M22,5.1H7.5c-.6,0-1,.4-1,1s.4,1,1,1h14.5c.6,0,1-.5,1-1s-.4-1-1-1Z"/><path fill="currentColor" d="M7.5,13h8.9c.6,0,1-.5,1-1s-.4-1-1-1H7.5c-.6,0-1,.4-1,1s.4,1,1,1Z"/><path fill="currentColor" d="M19.8,17H7.5c-.6,0-1,.4-1,1s.4,1,1,1h12.3c.6,0,1-.5,1-1s-.4-1-1-1Z"/>',
  '<path fill="currentColor" d="M14.5 8a3 3 0 1 0-2.7-4.3c-.2.4.06.86.44 1.12a5 5 0 0 1 2.14 3.08c.01.06.06.1.12.1ZM18.44 17.27c.15.43.54.73 1 .73h1.06c.83 0 1.5-.67 1.5-1.5a7.5 7.5 0 0 0-6.5-7.43c-.55-.08-.99.38-1.1.92-.06.3-.15.6-.26.87-.23.58-.05 1.3.47 1.63a9.53 9.53 0 0 1 3.83 4.78ZM12.5 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2 20.5a7.5 7.5 0 0 1 15 0c0 .83-.67 1.5-1.5 1.5a.2.2 0 0 1-.2-.16c-.2-.96-.56-1.87-.88-2.54-.1-.23-.42-.15-.42.1v2.1a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2.1c0-.25-.31-.33-.42-.1-.32.67-.67 1.58-.88 2.54a.2.2 0 0 1-.2.16A1.5 1.5 0 0 1 2 20.5Z"/>',
  '<path fill="currentColor" fill-rule="evenodd" d="M23 12.38c-.02.38-.45.58-.78.4a6.97 6.97 0 0 0-6.27-.08.54.54 0 0 1-.44 0 8.97 8.97 0 0 0-11.16 3.55c-.1.15-.1.35 0 .5.37.58.8 1.13 1.28 1.61.24.24.64.15.8-.15.19-.38.39-.73.58-1.02.14-.21.43-.1.4.15l-.19 1.96c-.02.19.07.37.23.47A8.96 8.96 0 0 0 12 21a.4.4 0 0 1 .38.27c.1.33.25.65.4.95.18.34-.02.76-.4.77L12 23a11 11 0 1 1 11-10.62ZM15.5 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd"></path><path fill="currentColor" d="M24 19a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"></path>',
  '<path fill="currentColor" d="M7.5,3c0-0.4,0.3-0.8,0.8-0.8c1.3,0,2.4,0.4,3.1,0.8c0.3,0.1,0.5,0.3,0.7,0.4c0.2-0.1,0.4-0.3,0.7-0.4c0.9-0.5,2-0.8,3.1-0.8c0.4,0,0.8,0.3,0.8,0.8c0,0.4-0.3,0.8-0.8,0.8c-1,0-1.8,0.3-2.3,0.7c-0.2,0.1-0.4,0.3-0.7,0.4v6.4h0.8c0.4,0,0.8,0.3,0.8,0.8c0,0.4-0.3,0.8-0.8,0.8h-0.8v6.4c0.1,0.1,0.4,0.3,0.7,0.4c0.6,0.3,1.4,0.6,2.3,0.6c0.4,0,0.8,0.3,0.8,0.8c0,0.4-0.3,0.8-0.8,0.8c-1.1,0-2.1-0.3-3.1-0.9c-0.2-0.1-0.4-0.3-0.7-0.4c-0.2,0.2-0.4,0.3-0.7,0.4c-0.9,0.5-2,0.8-3.1,0.8c-0.4,0-0.8-0.3-0.8-0.8c0-0.4,0.3-0.8,0.8-0.8c1,0,1.8-0.3,2.3-0.7c0.3-0.2,0.5-0.3,0.7-0.4v-6.4h-0.8c-0.4,0-0.8-0.3-0.8-0.8c0-0.4,0.3-0.8,0.8-0.8h0.8V4.8c-0.2-0.2-0.4-0.3-0.7-0.4C9.9,4,9.1,3.8,8.2,3.8C7.8,3.8,7.5,3.4,7.5,3z"/><path fill="currentColor" d="M15.7,7.5h4.5c1.2,0,2.2,1,2.2,2.2v4.5c0,1.2-1,2.2-2.2,2.2h-4.5c-0.4,0-0.7,0.3-0.7,0.8l0,0c0,0.4,0.3,0.8,0.7,0.8h4.5c2.1,0,3.8-1.7,3.8-3.7V9.7C24,7.7,22.3,6,20.2,6h-4.5C15.3,6,15,6.3,15,6.7v0C15,7.2,15.3,7.5,15.7,7.5z M9,6.8L9,6.8C9,6.3,8.7,6,8.3,6H3.7C1.7,6,0,7.7,0,9.7v4.5C0,16.3,1.7,18,3.7,18h4.5C8.7,18,9,17.7,9,17.2l0,0c0-0.4-0.3-0.8-0.7-0.8H3.7c-1.2,0-2.2-1-2.2-2.2V9.7c0-1.2,1-2.2,2.2-2.2h4.5C8.7,7.5,9,7.2,9,6.8z"/>',
  '<path fill="currentColor" d="M22.3,4.3C22,3.8,21.5,3.4,21,3.1c-0.6-0.4-1.4-0.6-2.2-0.6H5.1C4.3,2.5,3.6,2.7,3,3.1C2.6,3.3,2.2,3.6,1.9,4C1.3,4.7,1,5.6,1,6.6v10.9c0,2.2,1.8,4.1,4.1,4.1h13.7c2.3,0,4.1-1.8,4.1-4.1V6.6C23,5.7,22.8,5,22.3,4.3z M10.5,3.6c0.5,0,0.9,0.4,0.9,0.9c0,0.5-0.4,0.9-0.9,0.9c-0.5,0-1-0.4-1-0.9C9.5,4,9.9,3.6,10.5,3.6z M7.6,3.6c0.5,0,0.9,0.4,0.9,0.9c0,0.5-0.4,0.9-0.9,0.9c-0.5,0-1-0.4-1-0.9C6.7,4,7.1,3.6,7.6,3.6z M4.8,3.6c0.5,0,1,0.4,1,0.9c0,0.5-0.4,0.9-1,0.9c-0.5,0-0.9-0.4-0.9-0.9C3.9,4,4.3,3.6,4.8,3.6z M21.6,17.4c0,0.7-0.3,1.4-0.8,1.9c-0.1,0.1-0.1,0.1-0.2,0.2c-0.1,0.1-0.1,0.1-0.2,0.2c-0.2,0.2-0.5,0.3-0.7,0.3c-0.3,0.1-0.5,0.1-0.8,0.1H5.1c-0.3,0-0.6,0-0.8-0.1c-0.3-0.1-0.5-0.2-0.7-0.3c-0.1,0-0.2-0.1-0.2-0.2c-0.1-0.1-0.1-0.1-0.2-0.2c-0.5-0.5-0.8-1.2-0.8-1.9V9.3c0-1.5,1.2-2.8,2.8-2.8h13.8c1.5,0,2.7,1.2,2.7,2.7V17.4z"/>',
  '<path fill="currentColor" d="M20.7,16.2c-0.1-0.1-0.2-0.2-0.3-0.2c-0.5-0.4-1-0.8-1.6-1.1l-0.3-0.2c-0.7-0.5-1.3-0.7-1.8-0.7c-0.8,0-1.4,0.4-2,1.2c-0.2,0.4-0.5,0.5-0.9,0.5c-0.3,0-0.5-0.1-0.7-0.2c-2.2-1-3.7-2.5-4.6-4.4C8,10.2,8.2,9.5,8.9,9c0.4-0.3,1.2-0.8,1.2-1.8C10,6,7.4,2.5,6.3,2.1C5.9,2,5.4,2,4.9,2.1C3.7,2.5,2.8,3.3,2.3,4.2c-0.4,0.9-0.4,2,0.1,3.2C3.7,10.7,5.6,13.6,8,16c2.4,2.3,5.2,4.2,8.6,5.7c0.3,0.1,0.6,0.2,0.9,0.3c0.1,0,0.1,0,0.2,0c0,0,0.1,0,0.1,0h0c1.6,0,3.5-1.4,4.1-3.1C22.4,17.5,21.4,16.8,20.7,16.2z"/>',
  '<path fill="currentColor" d="M21.2,7.6H2.8C1.3,7.6,0,8.8,0,10.3v3.3c0,1.5,1.3,2.8,2.8,2.8h18.4c1.5,0,2.8-1.3,2.8-2.8v-3.3C24,8.8,22.7,7.6,21.2,7.6z M17.4,10.7c0.7,0,1.3,0.6,1.3,1.3s-0.6,1.3-1.3,1.3s-1.3-0.6-1.3-1.3S16.7,10.7,17.4,10.7z M3.9,10.1c1.1,0,1.9,0.9,1.9,1.9S5,13.9,3.9,13.9S2,13.1,2,12S2.9,10.1,3.9,10.1z M20.7,10.7c0.7,0,1.3,0.6,1.3,1.3s-0.6,1.3-1.3,1.3s-1.3-0.6-1.3-1.3S20,10.7,20.7,10.7z M6.5,10.8C6.5,10.8,6.5,10.8,6.5,10.8c0-0.4,0.3-0.7,0.8-0.7h6.3c0.4,0,0.7,0.3,0.8,0.7c0,0,0,0,0,0v0c0,0.4-0.3,0.8-0.8,0.8H7.2C6.8,11.6,6.5,11.2,6.5,10.8L6.5,10.8z M7.2,12.4h6.3c0.4,0,0.8,0.3,0.8,0.8c0,0,0,0,0,0.1c0,0.4-0.4,0.7-0.7,0.7H7.2c-0.4,0-0.7-0.3-0.7-0.7c0,0,0,0,0-0.1C6.5,12.8,6.8,12.4,7.2,12.4z"/>',
  '<path fill="currentColor" d="M22,5.1h-11c-.6,0-1,.4-1,1s.4,1,1,1h11c.6,0,1-.5,1-1s-.4-1-1-1Z"/><path fill="currentColor" d="M22,17H2c-.6,0-1,.4-1,1s.4,1,1,1h20c.6,0,1-.5,1-1s-.4-1-1-1Z"/><path fill="currentColor" d="M22,11h-11c-.6,0-1,.4-1,1s.4,1,1,1h11c.6,0,1-.5,1-1s-.4-1-1-1Z"/><path fill="currentColor" d="M1,8.3c0,1.8,1.5,3.3,3.3,3.3s.7,0,1-.2l.9,1.2c.4.5.9.6,1.4.2.5-.4.6-.9.2-1.4l-.9-1.2c.4-.5.6-1.2.6-1.9,0-1.8-1.5-3.3-3.3-3.3s-3.3,1.5-3.3,3.3ZM3,8.3c0-.7.6-1.3,1.3-1.3s1.3.6,1.3,1.3-.6,1.3-1.3,1.3-1.3-.6-1.3-1.3Z"/>',
  '<path fill="currentColor" d="M22,5.1h-11c-.6,0-1,.4-1,1s.4,1,1,1h11c.6,0,1-.5,1-1s-.4-1-1-1Z"/><path fill="currentColor" d="M22,17H2c-.6,0-1,.4-1,1s.4,1,1,1h20c.6,0,1-.5,1-1s-.4-1-1-1Z"/><path fill="currentColor" d="M22,11h-11c-.6,0-1,.4-1,1s.4,1,1,1h11c.6,0,1-.5,1-1s-.4-1-1-1Z"/><path fill="currentColor" d="M6.9,5.1H2c-.5,0-1,.5-1,1v1.1c0,.6.5,1,1,1s1-.4,1-1h0c0-.1.5-.1.5-.1v3.9h-.1c-.6,0-1,.5-1,1s.4,1,1,1h2.2c.6,0,1-.5,1-1s-.4-1-1-1h-.1v-3.9h.5c0,.7.5,1.1,1,1.1s1-.4,1-1v-1.1c0-.5-.5-1-1-1Z"/>',
  '<path fill="currentColor" d="M7.5,8.2l-4.9-3c-.2,0-.3-.1-.5-.1-.6,0-1,.4-1,1v5.9c0,.2,0,.4.1.5.3.5.9.6,1.4.3l4.9-3h0c.1,0,.3-.2.3-.3.3-.5.1-1.1-.3-1.4Z"/><path fill="currentColor" d="M22,5.1h-11c-.6,0-1,.4-1,1s.4,1,1,1h11c.6,0,1-.5,1-1s-.4-1-1-1Z"/><path fill="currentColor" d="M22,17H2c-.6,0-1,.4-1,1s.4,1,1,1h20c.6,0,1-.5,1-1s-.4-1-1-1Z"/><path fill="currentColor" d="M22,11h-11c-.6,0-1,.4-1,1s.4,1,1,1h11c.6,0,1-.5,1-1s-.4-1-1-1Z"/>',
];

// Define button index constants
const constants = {
  I_SERVER_LIST: 0,
  I_CHANNEL_LIST: 1,
  I_MEMBERS_LIST: 2,
  I_USER_PROFILE: 3,
  I_MESSAGE_INPUT: 4,
  I_WINDOW_BAR: 5,
  I_CALL_WINDOW: 6,
  I_USER_AREA: 7,
  I_SEARCH_PANEL: 8,
  I_FORUM_POPOUT: 9,
  I_ACTIVITY_PANEL: 10,
  I_SETTINGS_BUTTONS: 0,
  I_MESSAGE_INPUT_BUTTONS: 1,
  I_TOOLBAR_BUTTONS: 2,
  I_TOOLBAR_FULL: 3,
};

// Abstract webpack modules
const modules = {
  get members() { return this._members ?? (this._members = runtime.api.Webpack.getByKeys('membersWrap', 'hiddenMembers', 'roleIcon')); },
  get icons() { return this._icons ?? (this._icons = runtime.api.Webpack.getByKeys('selected', 'iconWrapper', 'clickable', 'icon')); },
  get dispatcher() { return this._dispatcher ?? (this._dispatcher = runtime.api.Webpack.getByKeys('dispatch', 'isDispatching')); },
  get social() { return this._social ?? (this._social = runtime.api.Webpack.getByKeys('inviteToolbar', 'peopleColumn', 'addFriend')); },
  get toolbar() { return this._toolbar ?? (this._toolbar = runtime.api.Webpack.getByKeys('updateIconForeground', 'search', 'forumOrHome')); },
  get panel() { return this._panel ?? (this._panel = runtime.api.Webpack.getByKeys('biteSize', 'fullSize', 'panel', 'outer', 'inner', 'overlay')); },
  get guilds() { return this._guilds ?? (this._guilds = runtime.api.Webpack.getByKeys('chatContent', 'noChat', 'parentChannelName', 'linkedLobby')); },
  get frame() { return this._frame ?? (this._frame = runtime.api.Webpack.getByKeys('typeMacOS', 'typeWindows', 'withBackgroundOverride')); },
  get calls() { return this._calls ?? (this._calls = runtime.api.Webpack.getByKeys('wrapper', 'fullScreen', 'callContainer')); },
  get threads() { return this._threads ?? (this._threads = runtime.api.Webpack.getByKeys('uploadArea', 'newMemberBanner', 'mainCard', 'newPostsButton')); },
  get user() { return this._user ?? (this._user = runtime.api.Webpack.getByKeys('avatar', 'nameTag', 'customStatus', 'emoji', 'buttons')); },
  get input() { return this._input ?? (this._input = runtime.api.Webpack.getByKeys('channelTextArea', 'accessoryBar', 'emojiButton')); },
  get popout() { return this._popout ?? (this._popout = runtime.api.Webpack.getByKeys('chatLayerWrapper', 'container', 'chatTarget')); },
  get sidebar() { return this._sidebar ?? (this._sidebar = runtime.api.Webpack.getByKeys('sidebar', 'activityPanel', 'sidebarListRounded')); },
  get effects() { return this._effects ?? (this._effects = runtime.api.Webpack.getByKeys('profileEffects', 'hovered', 'effect')); },
  get search() { return this._search ?? (this._search = runtime.api.Webpack.getByKeys('searchResultsWrap', 'stillIndexing', 'noResults')); },
  get tooltip() { return this._tooltip ?? (this._tooltip = runtime.api.Webpack.getByKeys('menu', 'label', 'caret')); },
  get preview() { return this._preview ?? (this._preview = runtime.api.Webpack.getByKeys('popout', 'more', 'title', 'timestamp', 'name')); },
  get channels() { return this._channels ?? (this._channels = runtime.api.Webpack.getByKeys('channel', 'closeIcon', 'dm')); },
  get activity() { return this._activity ?? (this._activity = runtime.api.Webpack.getByKeys('itemCard', 'emptyCard', 'emptyText')); },
  get callIcons() { return this._callIcons ?? (this._callIcons = runtime.api.Webpack.getByKeys('button', 'divider', 'lastButton')); },
};

const elements = {
  get inviteToolbar() { return document.querySelector(`.${modules.social?.inviteToolbar}`); },
  get searchBar() { return document.querySelector(`.${modules.toolbar?.search}`); },
  get toolbar() { return document.querySelector(`.${modules.icons?.toolbar}`); },
  get membersList() { return document.querySelector(`.${modules.members?.membersWrap}`); },
  get userProfile() { return document.querySelector(`.${modules.panel?.inner}.${modules.panel?.panel}`); },
  get messageInput() { return document.querySelector(`.${modules.guilds?.form}`); },
  get windowBar() { return document.querySelector(`.${modules.frame?.titleBar}`); },
  get callWindow() { return document.querySelector(`.${modules.calls?.wrapper}:not(.${modules.calls?.noChat})`); },
  get settingsContainer() { return document.querySelector(`.${modules.user?.buttons}`); },
  get messageInputContainer() { return document.querySelector(`.${modules.input?.buttons}`); },
  get forumPopout() { return document.querySelector(`.${modules.popout?.chatLayerWrapper}`); },
  get biteSizePanel() { return document.querySelector(`.${modules.panel?.outer}.${modules.panel?.biteSize}`); },
  get userArea() { return document.querySelector(`.${modules.sidebar?.panels}`); },
  get serverList() { return document.querySelector(`.${modules.sidebar?.guilds}`); },
  get channelList() { return document.querySelector(`.${modules.sidebar?.sidebar}`); },
  get rightClickMenu() { return document.querySelector(`.${modules.tooltip?.menu}`); },
  get forumPreviewTooltip() { return document.querySelector(`.${modules.preview?.popout}`); },
  get bdPluginFolderButton() { return document.querySelector('button:has([d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"])'); },
  get searchPanel() { return document.querySelector(`.${modules.search?.searchResultsWrap}`); },
  get activityPanel() { return document.querySelector(`.${modules.social?.nowPlayingColumn}`); },
  get chatWrapper() { return document.querySelector(`.${modules.guilds?.content}`); },
  get noChat() { return document.querySelector(`.${modules.calls?.noChat}`); },
  get expressionPicker() { return document.querySelector(`.${modules.input?.expressionPickerPositionLayer}`); },
  get index() {
    return [
      this.serverList,
      this.channelList,
      this.membersList,
      this.userProfile,
      this.messageInput,
      this.windowBar,
      this.callWindow,
      this.userArea,
      this.searchPanel,
      this.forumPopout,
      this.activityPanel,
    ];
  },
};

// Declare runtime object structure
const runtime = {
  meta: null,
  api: null,
  plugin: null,
  notice: null,
  toolbar: null,
  dragging: null,
  interval: null,
  threadsLoaded: false,
  collapsed: [false, false, false, false, false, false, false, false, false, false, false],
  keys: new Set(),
  lastKeypress: Date.now(),

  // Controls all event listeners
  get controller() {
    if (this._controller && this._controller.signal.aborted) this._controller = null;
    return this._controller ?? (this._controller = new AbortController());
  },

  // Scans for changes that require a toolbar/style reload
  get observer() {
    return this._observer ?? (this._observer = new MutationObserver((mutationList) => {
      mutationList.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.classList?.contains(modules.panel?.outer)
            || node.classList?.contains(modules.search?.searchResultsWrap)
            || node.classList?.contains(modules.popout?.chatLayerWrapper)) {
            this.plugin.partialReload();
          }
        });
        mutation.removedNodes.forEach((node) => {
          if (node.classList?.contains(modules.panel?.outer)
            || node.classList?.contains(modules.search?.searchResultsWrap)
            || node.classList?.contains(modules.popout?.chatLayerWrapper)) {
            this.plugin.partialReload();
          }
        });
      });
    }));
  },
};

// Abstract stylesheet application
const styleFunctions = {

  // This element's toggle state
  _toggled: true,

  // Add initial element styles
  init: function () {
    if (this._init) runtime.api.DOM.addStyle(...this._init);
    if (this._float
      && settings.floatingPanels
      && settings.floatingEnabled[this._index] === 'always')
      runtime.api.DOM.addStyle(...this._float);
  },

  // Toggle this element's collapsed state
  toggle: function () {
    if (!settings.collapseDisabledButtons && settings.buttonIndexes[this._index] === 0) {
      this._toggled = !this._toggled;
      return;
    }

    styles.update();

    if ((!settings.expandOnHover) || (!settings.expandOnHoverEnabled[this._index])) {
      if (this._toggled) runtime.api.DOM.addStyle(...this._toggle);
      else runtime.api.DOM.removeStyle(this._toggle[0]);
    }
    else {
      if (this._toggled) {
        runtime.api.DOM.addStyle(`${this._toggle[0]}_dynamic`, this._toggle[1]);
        if (this._float
          && settings.floatingPanels
          && settings.floatingEnabled[this._index] === 'hover')
          setTimeout(() => runtime.api.DOM.addStyle(...this._float), settings.transitionSpeed);
      }
      else {
        runtime.api.DOM.removeStyle(`${this._toggle[0]}_dynamic`);
        if (this._float
          && settings.floatingPanels
          && settings.floatingEnabled[this._index] === 'hover')
          runtime.api.DOM.removeStyle(this._float[0]);
      }
    }

    this._toggled = !this._toggled;
  },

  // Make this element float above other UI elements
  float: function () {
    if (this._float) runtime.api.DOM.addStyle(...this._float);
  },

  // Remove all custom styles from this element
  clear: function () {
    if (this._clear) this._clear();

    if (this._init) runtime.api.DOM.removeStyle(this._init[0]);
    if (this._float) runtime.api.DOM.removeStyle(this._float[0]);
    if (this._queryToggle) runtime.api.DOM.removeStyle(this._queryToggle[0]);

    if (this._toggle) {
      runtime.api.DOM.removeStyle(this._toggle[0]);
      runtime.api.DOM.removeStyle(`${this._toggle[0]}_dynamic`);
    }

    if (this.__init) delete this.__init;
    if (this.__float) delete this.__float;
    if (this.__queryToggle) delete this.__queryToggle;
    if (this.__toggle) delete this.__toggle;

    this._toggled = true;
  },
};

// Define static styles
const styles = {

  // Collapsible panels
  collapse: [
    // Server list [I_SERVER_LIST]
    {
      _index: constants.I_SERVER_LIST,
      get _init() {
        return this.__init ?? (this.__init = [`${runtime.meta.name}-serverList_init`, `
          .${modules.sidebar?.guilds} {
            transition: width var(--cui-transition-speed);
          }

          .${modules.sidebar?.base} {
            transition: top var(--cui-transition-speed);
          }

          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                ${this._toggle[1]}
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      get _toggle() {
        return this.__toggle ?? (this.__toggle = [`${runtime.meta.name}-serverList_toggle`, `
          .${modules.sidebar?.guilds} {
            width: var(--cui-collapse-size) !important;
          }

          .${modules.sidebar?.base} {
            --server-container: 0px;
          }
        `.replace(/\s+/g, ' ')]);
      },
      get _float() {
        return this.__float ?? (this.__float = [`${runtime.meta.name}-serverList_float`, `
          .${modules.sidebar?.guilds} {
            position: absolute !important;
            box-shadow: var(--shadow-ledge-right);
            z-index: 191 !important;
            min-height: 100% !important;
            overflow-y: scroll !important;
            max-height: ${runtime.api.Themes.isEnabled('Horizontal Server List') ? '100vw' : '100%'} !important;
          }
        `.replace(/\s+/g, ' ')]);
      },
      get query() {
        return runtime.api.Themes.isEnabled('Horizontal Server List')
          ? `(max-height: ${settings.sizeCollapseThreshold[this._index]}px)`
          : `(max-width: ${settings.sizeCollapseThreshold[this._index]}px)`;
      },
      get _queryToggle() {
        return this.__queryToggle ?? (this.__queryToggle = [`${runtime.meta.name}-serverList_queryToggle`, `
          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                .${modules.sidebar?.guilds} {
                  width: ${settings.serverListWidth}px !important;
                }

                .${modules.sidebar?.base} {
                  --server-container: inherit;
                }
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      ...styleFunctions,
    },

    // Channel list [I_CHANNEL_LIST]
    {
      _index: constants.I_CHANNEL_LIST,
      get _init() {
        return this.__init ?? (this.__init = [`${runtime.meta.name}-channelList_init`, `
          :root {
            --cui-channel-list-handle-offset: calc(var(--cui-channel-list-width) - 12px);
            --cui-channel-list-handle-transition: left var(--cui-transition-speed);
          }

          .${modules.sidebar?.sidebar}.${modules.sidebar?.sidebar}.${modules.sidebar?.sidebar}.${modules.sidebar?.sidebar}.${modules.sidebar?.sidebar} {
            max-width: var(--cui-channel-list-width) !important;
            width: var(--cui-channel-list-width) !important;
            min-width: var(--cui-channel-list-width) !important;
            transition: max-width var(--cui-transition-speed), width var(--cui-transition-speed), min-width var(--cui-transition-speed);
            min-height: 100% !important;
            overflow: visible !important;
          }

          .${modules.sidebar?.sidebar} > * {
            overflow: hidden !important;
          }

          .${modules.channels?.channel} {
            max-width: 100% !important;
          }

          .${modules.user?.avatarWrapper} {
            min-width: 32px !important;
          }

          ${(settings.channelListWidth)
            ? `
              .${modules.sidebar?.sidebar}:before {
                cursor: e-resize;
                z-index: 200;
                position: absolute;
                content: "";
                width: 16px;
                height: 100%;
                left: var(--cui-channel-list-handle-offset);
                transition: var(--cui-channel-list-handle-transition);
              }
            `
            : ''}

          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                ${this._toggle[1]}
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      get _toggle() {
        return this.__toggle ?? (this.__toggle = [`${runtime.meta.name}-channelList_toggle`, `
          .${modules.sidebar?.sidebar}.${modules.sidebar?.sidebar}.${modules.sidebar?.sidebar}.${modules.sidebar?.sidebar}.${modules.sidebar?.sidebar} {
            max-width: var(--cui-collapse-size) !important;
            width: var(--cui-collapse-size) !important;
            min-width: var(--cui-collapse-size) !important;
          }

          ${(settings.channelListWidth)
            ? `
              .${modules.sidebar?.sidebar}:before {
                left: -4px;
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      get _float() {
        return this.__float ?? (this.__float = [`${runtime.meta.name}-channelList_float`, `
          .${modules.sidebar?.sidebar} {
            position: absolute !important;
            box-shadow: var(--shadow-ledge-right);
            z-index: 190 !important;
            max-height: 100% !important;
            height: 100% !important;
          }
        `.replace(/\s+/g, ' ')]);
      },
      get query() { return `(max-width: ${settings.sizeCollapseThreshold[this._index]}px)`; },
      get _queryToggle() {
        return this.__queryToggle ?? (this.__queryToggle = [`${runtime.meta.name}-channelList_queryToggle`, `
          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                .${modules.sidebar?.sidebar}.${modules.sidebar?.sidebar}.${modules.sidebar?.sidebar}.${modules.sidebar?.sidebar}.${modules.sidebar?.sidebar} {
                  max-width: var(--cui-channel-list-width) !important;
                  width: var(--cui-channel-list-width) !important;
                  min-width: var(--cui-channel-list-width) !important;
                }

                ${(settings.channelListWidth)
            ? `
                    .${modules.sidebar?.sidebar}:before {
                      left: calc(var(--cui-channel-list-width) - 4px);
                    }
                  `
            : ''}
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      ...styleFunctions,
    },

    // Members list [I_MEMBERS_LIST]
    {
      _index: constants.I_MEMBERS_LIST,
      get _init() {
        return this.__init ?? (this.__init = [`${runtime.meta.name}-membersList_init`, `
          .${modules.members?.membersWrap} {
            max-width: var(--cui-members-list-width) !important;
            width: var(--cui-members-list-width) !important;
            min-width: var(--cui-members-list-width) !important;
            transition: max-width var(--cui-transition-speed), width var(--cui-transition-speed), min-width var(--cui-transition-speed), padding var(--cui-transition-speed);
            min-height: 100% !important;
          }

          .${modules.members?.membersWrap} > * {
            width: 100% !important;
          }

          .${modules.members?.membersWrap} * {
            max-width: 100% !important;
          }

          ${(settings.membersListWidth)
            ? `
              .${modules.members?.membersWrap}:before {
                cursor: e-resize;
                z-index: 200;
                position: absolute;
                content: "";
                width: 16px;
                height: 100%;
                left: -4px;
              }
            `
            : ''}

          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                ${this._toggle[1]}
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      get _toggle() {
        return this.__toggle ?? (this.__toggle = [`${runtime.meta.name}-membersList_toggle`, `
          .${modules.members?.membersWrap} {
            max-width: var(--cui-collapse-size) !important;
            width: var(--cui-collapse-size) !important;
            min-width: var(--cui-collapse-size) !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
        `.replace(/\s+/g, ' ')]);
      },
      get _float() {
        return this.__float ?? (this.__float = [`${runtime.meta.name}-membersList_float`, `
          .${modules.members?.membersWrap} {
            position: absolute !important;
            box-shadow: var(--shadow-ledge-left);
            z-index: 190 !important;
            max-height: 100% !important;
            height: 100% !important;
            right: 0 !important;
          }

          .${modules.members?.membersWrap}:after {
            content: "";
            position: absolute;
            top: -1px;
            left: 0;
            width: 100%;
            height: 1px;
            box-shadow: var(--shadow-ledge);
          }
        `.replace(/\s+/g, ' ')]);
      },
      get query() { return `(max-width: ${settings.sizeCollapseThreshold[this._index]}px)`; },
      get _queryToggle() {
        return this.__queryToggle ?? (this.__queryToggle = [`${runtime.meta.name}-membersList_queryToggle`, `
          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                .${modules.members?.membersWrap} {
                  max-width: var(--cui-members-list-width) !important;
                  width: var(--cui-members-list-width) !important;
                  min-width: var(--cui-members-list-width) !important;
                }
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      ...styleFunctions,
    },

    // User profile [I_USER_PROFILE]
    {
      _index: constants.I_USER_PROFILE,
      get _init() {
        if (document.querySelector(`.${modules.panel?.outer} header > svg`)) document.querySelector(`.${modules.panel?.outer} header > svg`).style.maxHeight = document.querySelector(`.${modules.panel?.outer} header > svg`).style.minHeight;
        document.querySelector(`.${modules.panel?.outer} header > svg > mask > rect`)?.setAttribute('width', '500%');
        document.querySelector(`.${modules.panel?.outer} header > svg`)?.removeAttribute('viewBox');
        return this.__init ?? (this.__init = [`${runtime.meta.name}-userProfile_init`, `
          .${modules.panel?.outer}.${modules.panel?.panel} {
            max-width: var(--cui-user-profile-width) !important;
            width: var(--cui-user-profile-width) !important;
            min-width: var(--cui-user-profile-width) !important;
            transition: max-width var(--cui-transition-speed), width var(--cui-transition-speed), min-width var(--cui-transition-speed);
            min-height: 100% !important;
          }

          .${modules.panel?.outer}.${modules.panel?.panel} > * {
            width: 100% !important;
          }

          .${modules.panel?.outer}.${modules.panel?.panel} header > svg {
            min-width: 100% !important;
          }

          .${modules.panel?.outer}.${modules.panel?.panel} header > svg > mask > rect {
            width: 500% !important;
          }

          .${modules.panel?.outer}.${modules.panel?.panel} .${modules.effects?.effect} {
            min-height: 100% !important;
          }

          ${(settings.userProfileWidth)
            ? `
              .${modules.panel?.outer}.${modules.panel?.panel}:before {
                cursor: e-resize;
                z-index: 200;
                position: absolute;
                content: "";
                width: 16px;
                height: 100%;
                left: -4px;
              }
            `
            : ''}

          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                ${this._toggle[1]}
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      get _toggle() {
        return this.__toggle ?? (this.__toggle = [`${runtime.meta.name}-userProfile_toggle`, `
          .${modules.panel?.outer}.${modules.panel?.panel} {
            max-width: var(--cui-collapse-size) !important;
            width: var(--cui-collapse-size) !important;
            min-width: var(--cui-collapse-size) !important;
          }
        `.replace(/\s+/g, ' ')]);
      },
      get _float() {
        return this.__float ?? (this.__float = [`${runtime.meta.name}-userProfile_float`, `
          .${modules.panel?.outer}.${modules.panel?.panel} {
            position: absolute !important;
            box-shadow: var(--shadow-ledge-left);
            z-index: 190 !important;
            max-height: 100% !important;
            height: 100% !important;
            right: 0 !important;
          }

          .${modules.panel?.outer}.${modules.panel?.panel}:after {
            content: "";
            position: absolute;
            top: -1px;
            left: 0;
            width: 100%;
            height: 1px;
            box-shadow: var(--shadow-ledge);
          }
        `.replace(/\s+/g, ' ')]);
      },
      get query() { return `(max-width: ${settings.sizeCollapseThreshold[this._index]}px)`; },
      get _queryToggle() {
        return this.__queryToggle ?? (this.__queryToggle = [`${runtime.meta.name}-userProfile_queryToggle`, `
          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                .${modules.panel?.outer}.${modules.panel?.panel} {
                  max-width: var(--cui-user-profile-width) !important;
                  width: var(--cui-user-profile-width) !important;
                  min-width: var(--cui-user-profile-width) !important;
                }
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      _clear: function () {
        document.querySelector(`.${modules.panel?.outer} header > svg`)?.style.removeProperty('max-height');
        document.querySelector(`.${modules.panel?.outer} header > svg > mask > rect`)?.setAttribute('width', '100%');
        document.querySelector(`.${modules.panel?.outer} header > svg`)?.setAttribute('viewBox', `0 0 ${parseInt(document.querySelector(`.${modules.panel?.outer} header > svg`)?.style.minWidth)} ${parseInt(document.querySelector(`.${modules.panel?.outer} header > svg`)?.style.minHeight)}`);
      },
      ...styleFunctions,
    },

    // Message input [I_MESSAGE_INPUT]
    {
      _index: constants.I_MESSAGE_INPUT,
      get _init() {
        return this.__init ?? (this.__init = [`${runtime.meta.name}-messageInput_init`, `
          .${modules.guilds?.form} {
            max-height: calc(var(--custom-channel-textarea-text-area-max-height) + 24px) !important;
            overflow: hidden !important;
            transition: max-height var(--cui-transition-speed) !important;
          }
            
          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                ${this._toggle[1]}
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      get _toggle() {
        return this.__toggle ?? (this.__toggle = [`${runtime.meta.name}-messageInput_toggle`, `
          .${modules.guilds?.form}:not(:has([data-slate-string="true"])):not(:has([data-list-id="attachments"])) {
            max-height: var(--cui-collapse-size) !important;
          }
        `.replace(/\s+/g, ' ')]);
      },
      get _float() {
        return this.__float ?? (this.__float = [`${runtime.meta.name}-messageInput_float`, `
          .${modules.guilds?.form} {
            position: absolute !important;
            filter: drop-shadow(0px 0px 2px var(--opacity-black-16));
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
          }
        `.replace(/\s+/g, ' ')]);
      },
      get query() { return `(max-height: ${settings.sizeCollapseThreshold[this._index]}px)`; },
      get _queryToggle() {
        return this.__queryToggle ?? (this.__queryToggle = [`${runtime.meta.name}-messageInput_queryToggle`, `
          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                .${modules.guilds?.form}.${modules.guilds?.form}.${modules.guilds?.form}.${modules.guilds?.form}.${modules.guilds?.form} {
                  max-height: calc(var(--custom-channel-textarea-text-area-max-height) + 24px) !important;
                }
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      ...styleFunctions,
    },

    // Window bar [I_WINDOW_BAR]
    {
      _index: constants.I_WINDOW_BAR,
      get _init() {
        return this.__init ?? (this.__init = [`${runtime.meta.name}-windowBar_init`, `
          .${modules.frame?.titleBar} {
            transition: height var(--cui-transition-speed), margin-top var(--cui-transition-speed) !important;
          }
            
          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                ${this._toggle[1]}
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      get _toggle() {
        return this.__toggle ?? (this.__toggle = [`${runtime.meta.name}-windowBar_toggle`, `
          .${modules.frame?.titleBar} {
            overflow: hidden !important;
            height: var(--cui-collapse-size) !important;
            margin-top: 0 !important;
            padding-top: 0 !important;
          }

          .${modules.frame?.wordmark} {
            display: none !important;
          }
        `.replace(/\s+/g, ' ')]);
      },
      get _float() {
        return this.__float ?? (this.__float = [`${runtime.meta.name}-windowBar_float`, `
          .${modules.frame?.titleBar} {
            position: absolute !important;
            box-shadow: var(--shadow-ledge);
            left: 0 !important;
            right: 0 !important;
            top: 0 !important;
            background: var(--background-tertiary) !important;
          }

          .${modules.frame?.titleBar}:before {
            content: "";
            position: absolute;
            top: -${settings.windowBarMarginTop}px;
            left: 0;
            right: 0;
            height: ${settings.windowBarMarginTop}px;
            background: var(--background-tertiary);
            z-index: -1;
          }

          .${modules.frame?.wordmark} {
            transform: translateY(-${settings.windowBarMarginTop}px) !important;
          }
        `.replace(/\s+/g, ' ')]);
      },
      get query() { return `(max-height: ${settings.sizeCollapseThreshold[this._index]}px)`; },
      get _queryToggle() {
        return this.__queryToggle ?? (this.__queryToggle = [`${runtime.meta.name}-windowBar_queryToggle`, `
          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                .${modules.frame?.titleBar} {
                  height: ${settings.windowBarHeight}px !important;
                  margin-top: ${settings.windowBarMarginTop}px !important;
                }

                .${modules.frame?.wordmark} {
                  display: initial !important;
                }
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      ...styleFunctions,
    },

    // Call window [I_CALL_WINDOW]
    {
      _index: constants.I_CALL_WINDOW,
      get _init() {
        return this.__init ?? (this.__init = [`${runtime.meta.name}-callWindow_init`, `
          .${modules.calls?.wrapper}:not(.${modules.calls?.noChat}) {
            transition: min-height var(--cui-transition-speed), max-height var(--cui-transition-speed) !important;
          }
            
          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                ${this._toggle[1]}
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      get _toggle() {
        return this.__toggle ?? (this.__toggle = [`${runtime.meta.name}-callWindow_toggle`, `
          .${modules.calls?.wrapper}:not(.${modules.calls?.noChat}) {
            min-height: var(--cui-collapse-size) !important;
            max-height: var(--cui-collapse-size) !important;
          }
        `.replace(/\s+/g, ' ')]);
      },
      get query() { return `(max-height: ${settings.sizeCollapseThreshold[this._index]}px)`; },
      get _queryToggle() {
        return [`${runtime.meta.name}-callWindow_queryToggle`, `
          .${modules.calls?.wrapper}:not(.${modules.calls?.noChat}) {
            min-height: ${elements.callWindow?.style.minHeight} !important;
            max-height: ${elements.callWindow?.style.maxHeight} !important;
          }
        `.replace(/\s+/g, ' ')];
      },
      ...styleFunctions,
    },

    // User area [I_USER_AREA]
    {
      _index: constants.I_USER_AREA,
      get _init() {
        return this.__init ?? (this.__init = [`${runtime.meta.name}-userArea_init`, `
          .${modules.sidebar?.panels} {
            transition: max-height var(--cui-transition-speed) !important;
            max-height: ${settings.userAreaMaxHeight}px !important;
          }
            
          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                ${this._toggle[1]}
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      get _toggle() {
        return this.__toggle ?? (this.__toggle = [`${runtime.meta.name}-userArea_toggle`, `
          .${modules.sidebar?.panels} {
            max-height: var(--cui-collapse-size) !important;
          }
        `.replace(/\s+/g, ' ')]);
      },
      get query() { return `(max-height: ${settings.sizeCollapseThreshold[this._index]}px)`; },
      get _queryToggle() {
        return this.__queryToggle ?? (this.__queryToggle = [`${runtime.meta.name}-userArea_queryToggle`, `
          .${modules.sidebar?.panels} {
            max-height: ${settings.userAreaMaxHeight}px !important;
          }
        `.replace(/\s+/g, ' ')]);
      },
      ...styleFunctions,
    },

    // Search panel [I_SEARCH_PANEL]
    {
      _index: constants.I_SEARCH_PANEL,
      get _init() {
        return this.__init ?? (this.__init = [`${runtime.meta.name}-searchPanel_init`, `
          .${modules.search?.searchResultsWrap} {
            max-width: var(--cui-search-panel-width) !important;
            width: var(--cui-search-panel-width) !important;
            min-width: var(--cui-search-panel-width) !important;
            transition: max-width var(--cui-transition-speed), width var(--cui-transition-speed), min-width var(--cui-transition-speed);
            overflow: visible !important;
          }

          .${modules.search?.searchResultsWrap} > header > div:last-child {
            justify-content: end !important;
          }

          ${(settings.searchPanelWidth)
            ? `
              .${modules.search?.searchResultsWrap}:before {
                cursor: e-resize;
                z-index: 200;
                position: absolute;
                content: "";
                width: 16px;
                height: 100%;
                left: -4px;
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      get _toggle() {
        return this.__toggle ?? (this.__toggle = [`${runtime.meta.name}-searchPanel_toggle`, `
          .${modules.search?.searchResultsWrap} {
            max-width: var(--cui-collapse-size) !important;
            width: var(--cui-collapse-size) !important;
            min-width: var(--cui-collapse-size) !important;
          }
        `.replace(/\s+/g, ' ')]);
      },
      get _float() {
        return this.__float ?? (this.__float = [`${runtime.meta.name}-searchPanel_float`, `
          .${modules.search?.searchResultsWrap} {
            position: absolute !important;
            box-shadow: var(--shadow-ledge-left);
            z-index: 190 !important;
            max-height: 100% !important;
            height: 100% !important;
            right: 0 !important;
          }

          .${modules.search?.searchResultsWrap}:after {
            content: "";
            position: absolute;
            top: -1px;
            left: 0;
            width: 100%;
            height: 1px;
            box-shadow: var(--shadow-ledge);
          }
        `.replace(/\s+/g, ' ')]);
      },
      get query() { return `(max-width: ${settings.sizeCollapseThreshold[this._index]}px)`; },
      get _queryToggle() {
        return this.__queryToggle ?? (this.__queryToggle = [`${runtime.meta.name}-searchPanel_queryToggle`, `
          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                .${modules.search?.searchResultsWrap} {
                  max-width: var(--cui-search-panel-width) !important;
                  width: var(--cui-search-panel-width) !important;
                  min-width: var(--cui-search-panel-width) !important;
                }
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      ...styleFunctions,
    },

    // Forum popout [I_FORUM_POPOUT]
    {
      _index: constants.I_FORUM_POPOUT,
      get _init() {
        return this.__init ?? (this.__init = [`${runtime.meta.name}-forumPopout_init`, `
          .${modules.popout?.chatLayerWrapper} {
            max-width: var(--cui-forum-popout-width) !important;
            width: var(--cui-forum-popout-width) !important;
            min-width: var(--cui-forum-popout-width) !important;
            transition: max-width var(--cui-transition-speed), width var(--cui-transition-speed), min-width var(--cui-transition-speed);
            position: absolute !important;
            z-index: 190 !important;
            top: var(--cui-forum-panel-top) !important;
            height: calc(100% - var(--cui-forum-panel-top)) !important;
            box-shadow: var(--shadow-ledge-left);
          }

          .${modules.toolbar?.forumOrHome} {
            --__header-bar-background: var(--background-primary);
          }

          .${modules.popout?.chatLayerWrapper} .${modules.icons?.container} {
            --__header-bar-background: var(--background-secondary);
          }

          div:not([class])[style^="min-width"],
          .${modules.popout?.resizeHandle} {
            display: none !important;
          }

          .${modules.popout?.chatLayerWrapper} > * {
            width: 100% !important;
            border-radius: 0 !important;
          }

          .${modules.guilds?.threadSidebarOpen} {
            flex-shrink: 999999999 !important;
          }

          .${modules.calls?.noChat} .${modules.calls?.callContainer} {
            border-radius: 0 !important;
          }

          .${modules.callIcons?.button},
          .${modules.callIcons?.lastButton} {
            margin-left: 8px !important;
            margin-right: 8px !important;
          }

          .${modules.guilds?.content},
          .${modules.calls?.noChat} {
            --width: var(--cui-forum-popout-width);
            --transition: max-width var(--cui-transition-speed), width var(--cui-transition-speed), min-width var(--cui-transition-speed);
          }

          .${modules.guilds?.content}:after,
          .${modules.calls?.noChat}:after {
            content: "";
            display: ${(elements.forumPopout) ? 'block' : 'none'};
            height: 100%;
            max-width: var(--width);
            width: var(--width);
            min-width: var(--width);
            transition: var(--transition);
            margin-left: 2px !important;
          }

          .${modules.popout?.floating} {
            filter: none !important;
            border-left: none !important;
          }

          .${modules.popout?.chatLayerWrapper}:after {
            content: "";
            position: absolute;
            top: -1px;
            left: 0;
            width: 100%;
            height: 1px;
            z-index: 200;
            box-shadow: var(--shadow-ledge);
          }

          ${(settings.forumPopoutWidth)
            ? `
              .${modules.popout?.chatLayerWrapper}:before {
                cursor: e-resize;
                z-index: 200;
                position: absolute;
                content: "";
                width: 16px;
                height: 100%;
                left: -4px;
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      get _toggle() {
        return this.__toggle ?? (this.__toggle = [`${runtime.meta.name}-forumPopout_toggle`, `
          .${modules.popout?.chatLayerWrapper} {
            max-width: var(--cui-collapse-size) !important;
            width: var(--cui-collapse-size) !important;
            min-width: var(--cui-collapse-size) !important;
          }

          .${modules.guilds?.content}:after,
          .${modules.calls?.noChat}:after {
            max-width: var(--cui-collapse-size);
            width: var(--cui-collapse-size);
            min-width: var(--cui-collapse-size);
          }
        `.replace(/\s+/g, ' ')]);
      },
      get _float() {
        return this.__float ?? (this.__float = [`${runtime.meta.name}-forumPopout_float`, `
          .${modules.guilds?.content}:after,
          .${modules.calls?.noChat}:after {
            max-width: 0 !important;
            width: 0 !important;
            min-width: 0 !important;
          }
        `.replace(/\s+/g, ' ')]);
      },
      get query() { return `(max-width: ${settings.sizeCollapseThreshold[this._index]}px)`; },
      get _queryToggle() {
        return this.__queryToggle ?? (this.__queryToggle = [`${runtime.meta.name}-forumPopout_queryToggle`, `
          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                .${modules.popout?.chatLayerWrapper} {
                  max-width: var(--cui-forum-popout-width) !important;
                  width: var(--cui-forum-popout-width) !important;
                  min-width: var(--cui-forum-popout-width) !important;
                }
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      _clear: function () {},
      ...styleFunctions,
    },

    // Activity panel [I_ACTIVITY_PANEL]
    {
      _index: constants.I_ACTIVITY_PANEL,
      get _init() {
        return this.__init ?? (this.__init = [`${runtime.meta.name}-activityPanel_init`, `
          .${modules.social?.nowPlayingColumn} {
            max-width: var(--cui-activity-panel-width) !important;
            width: var(--cui-activity-panel-width) !important;
            min-width: var(--cui-activity-panel-width) !important;
            transition: max-width var(--cui-transition-speed), width var(--cui-transition-speed), min-width var(--cui-transition-speed);
            display: initial !important;
          }

          .${modules.social?.nowPlayingColumn} > aside {
            background: inherit !important;
          }

          .${modules.social?.nowPlayingColumn} > aside > div {
            border-left: none !important;
            margin-left: 0 !important;
          }

          .${modules.activity?.itemCard} {
            overflow: hidden !important;
          }

          ${(settings.activityPanelWidth)
            ? `
              .${modules.social?.nowPlayingColumn}:before {
                cursor: e-resize;
                z-index: 200;
                position: absolute;
                content: "";
                width: 16px;
                height: 100%;
                transform: translateX(-4px);
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      get _toggle() {
        return this.__toggle ?? (this.__toggle = [`${runtime.meta.name}-activityPanel_toggle`, `
          .${modules.social?.nowPlayingColumn} {
            max-width: var(--cui-collapse-size) !important;
            width: var(--cui-collapse-size) !important;
            min-width: var(--cui-collapse-size) !important;
          }
        `.replace(/\s+/g, ' ')]);
      },
      get _float() {
        return this.__float ?? (this.__float = [`${runtime.meta.name}-activityPanel_float`, `
          .${modules.social?.nowPlayingColumn} {
            position: absolute !important;
            box-shadow: var(--shadow-ledge-left);
            z-index: 190 !important;
            right: 0 !important;
            height: 100% !important;
            max-height: 100% !important;
          }

          .${modules.social?.nowPlayingColumn}:after {
            content: "";
            position: absolute;
            top: -1px;
            left: 0;
            width: 100%;
            height: 1px;
            box-shadow: var(--shadow-ledge);
          }
        `.replace(/\s+/g, ' ')]);
      },
      get query() { return `(max-width: ${settings.sizeCollapseThreshold[this._index]}px)`; },
      get _queryToggle() {
        return this.__queryToggle ?? (this.__queryToggle = [`${runtime.meta.name}-activityPanel_queryToggle`, `
          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                .${modules.social?.nowPlayingColumn} {
                  max-width: var(--cui-activity-panel-width) !important;
                  width: var(--cui-activity-panel-width) !important;
                  min-width: var(--cui-activity-panel-width) !important;
                }
              }
            `
            : ''}
        `.replace(/\s+/g, ' ')]);
      },
      ...styleFunctions,
    },
  ],

  // Collapsible button groups
  buttons: [
    // User settings buttons [I_SETTINGS_BUTTONS]
    {
      hidden: false,
      init: function () {
        runtime.api.DOM.addStyle(`${runtime.meta.name}-settingsButtons_init_col`, `
          .${modules.user?.avatarWrapper} {
            flex-grow: 1 !important;
          }
  
          .${modules.user?.buttons} > *:not(:last-child) {
            transition: width var(--cui-transition-speed) !important;
            overflow: hidden !important;
          }
        `.replace(/\s+/g, ' '));
        if (settings.collapseSettings) this.hide();
      },
      hide: function () {
        runtime.api.DOM.addStyle(`${runtime.meta.name}-settingsButtons_hide_col`, `
          .${modules.user?.buttons} > *:not(:last-child) {
            width: 0px !important;
          }
        `.replace(/\s+/g, ' '));
        this.hidden = true;
      },
      show: function () {
        runtime.api.DOM.removeStyle(`${runtime.meta.name}-settingsButtons_hide_col`);
        this.hidden = false;
      },
      clear: function () {
        this.show();
        runtime.api.DOM.removeStyle(`${runtime.meta.name}-settingsButtons_init_col`);
      },
    },

    // Message input buttons [I_MESSAGE_INPUT_BUTTONS]
    {
      hidden: false,
      init: function () {
        runtime.api.DOM.addStyle(`${runtime.meta.name}-messageInputButtons_init_col`, `
          .${modules.input?.buttons} > *:not(:last-child) {
            transition: width var(--cui-transition-speed) !important;
            width: ${settings.messageInputButtonWidth}px !important;
            overflow: hidden !important;
          }
        `.replace(/\s+/g, ' '));
        if (settings.messageInputCollapse) this.hide();
      },
      hide: function () {
        runtime.api.DOM.addStyle(`${runtime.meta.name}-messageInputButtons_hide_col`, `
          .${modules.input?.buttons} > *:not(:last-child) {
            width: 0px !important;
          }
        `.replace(/\s+/g, ' '));
        this.hidden = true;
      },
      show: function () {
        runtime.api.DOM.removeStyle(`${runtime.meta.name}-messageInputButtons_hide_col`);
        this.hidden = false;
      },
      clear: function () {
        this.show();
        runtime.api.DOM.removeStyle(`${runtime.meta.name}-messageInputButtons_init_col`);
      },
    },

    // Toolbar buttons [I_TOOLBAR_BUTTONS]
    {
      hidden: false,
      init: function () {
        runtime.api.DOM.addStyle(`${runtime.meta.name}-toolbarButtons_init_col`, `
          .cui-toolbar > *:not(:last-child) {
            transition: width var(--cui-transition-speed) !important;
            width: 24px !important;
            overflow: hidden !important;
          }
        `.replace(/\s+/g, ' '));
        if (settings.collapseToolbar) this.hide();
      },
      hide: function () {
        runtime.api.DOM.addStyle(`${runtime.meta.name}-toolbarButtons_hide_col`, `
          .cui-toolbar > *:not(:last-child) {
            width: 0px !important;
            margin: 0px !important;
          }
        `.replace(/\s+/g, ' '));
        this.hidden = true;
      },
      show: function () {
        runtime.api.DOM.removeStyle(`${runtime.meta.name}-toolbarButtons_hide_col`);
        this.hidden = false;
      },
      clear: function () {
        this.show();
        runtime.api.DOM.removeStyle(`${runtime.meta.name}-toolbarButtons_init_col`);
      },
    },

    // Full toolbar [I_TOOLBAR_FULL]
    {
      hidden: false,
      init: function () {
        runtime.api.DOM.addStyle(`${runtime.meta.name}-toolbarFull_init_col`, `
          .${modules.icons?.toolbar} > *:not(:last-child) {
            transition: max-width var(--cui-transition-speed) !important;
            max-width: ${settings.toolbarElementMaxWidth}px !important;
            overflow: hidden !important;
          }
        `.replace(/\s+/g, ' '));
        if (settings.collapseToolbar === 'all') this.hide();
      },
      hide: function () {
        // Keep expanded while typing in search bar
        // Why is this classname not handled the same by Discord as other elements??
        if (document.querySelector('.public-DraftEditor-content[aria-expanded="true"]')) return;
        if (document.querySelector('.public-DraftEditor-content').querySelector('[data-text="true"]').innerHTML) return;

        runtime.api.DOM.addStyle(`${runtime.meta.name}-toolbarFull_hide_col`, `
          .${modules.icons?.toolbar} > *:not(:last-child) {
            max-width: 0px !important;
          }
        `.replace(/\s+/g, ' '));
        this.hidden = true;
      },
      show: function () {
        runtime.api.DOM.removeStyle(`${runtime.meta.name}-toolbarFull_hide_col`);
        this.hidden = false;
      },
      clear: function () {
        this.show();
        runtime.api.DOM.removeStyle(`${runtime.meta.name}-toolbarFull_init_col`);
      },
    },
  ],

  // Add initial element styles
  init: function () {
    // Add root styles
    runtime.api.DOM.addStyle(`${runtime.meta.name}-root`, `
      :root {
        --shadow-ledge-left: -2px 0 0 0 hsl(none 0% 0%/0.05), -1.5px 0 0 0 hsl(none 0% 0%/0.05), -1px 0 0 0 hsl(none 0% 0%/0.16);
        --shadow-ledge-right: 2px 0 0 0 hsl(none 0% 0%/0.05), 1.5px 0 0 0 hsl(none 0% 0%/0.05), 1px 0 0 0 hsl(none 0% 0%/0.16);
      }

      ::-webkit-scrollbar {
        width: 0px;
        background: transparent;
      }

      .cui-toolbar {
        align-items: right;
        display: flex;
      }

      .${modules.icons?.iconWrapper}:not([id*="cui"]):has([d="M14.5 8a3 3 0 1 0-2.7-4.3c-.2.4.06.86.44 1.12a5 5 0 0 1 2.14 3.08c.01.06.06.1.12.1ZM18.44 17.27c.15.43.54.73 1 .73h1.06c.83 0 1.5-.67 1.5-1.5a7.5 7.5 0 0 0-6.5-7.43c-.55-.08-.99.38-1.1.92-.06.3-.15.6-.26.87-.23.58-.05 1.3.47 1.63a9.53 9.53 0 0 1 3.83 4.78ZM12.5 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2 20.5a7.5 7.5 0 0 1 15 0c0 .83-.67 1.5-1.5 1.5a.2.2 0 0 1-.2-.16c-.2-.96-.56-1.87-.88-2.54-.1-.23-.42-.15-.42.1v2.1a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2.1c0-.25-.31-.33-.42-.1-.32.67-.67 1.58-.88 2.54a.2.2 0 0 1-.2.16A1.5 1.5 0 0 1 2 20.5Z"]),
      .${modules.icons?.iconWrapper}:not([id*="cui"]):has([d="M23 12.38c-.02.38-.45.58-.78.4a6.97 6.97 0 0 0-6.27-.08.54.54 0 0 1-.44 0 8.97 8.97 0 0 0-11.16 3.55c-.1.15-.1.35 0 .5.37.58.8 1.13 1.28 1.61.24.24.64.15.8-.15.19-.38.39-.73.58-1.02.14-.21.43-.1.4.15l-.19 1.96c-.02.19.07.37.23.47A8.96 8.96 0 0 0 12 21a.4.4 0 0 1 .38.27c.1.33.25.65.4.95.18.34-.02.76-.4.77L12 23a11 11 0 1 1 11-10.62ZM15.5 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"]) {
        display: none;
      }

      .${modules.threads?.grid}>div:first-child,
      .${modules.threads?.list}>div:first-child,
      .${modules.threads?.headerRow} {
        min-width: 0px !important;
      }
    `.replace(/\s+/g, ' '));

    // Init panel styles
    for (var i = 0; i < this.collapse.length; i++) {
      this.collapse[i].init();
      if (!settings.buttonsActive[i]) this.collapse[i].toggle();
    }

    // Init button group styles
    this.buttons.forEach(group => group.init());

    // Init dynamic styles
    this.update();
  },

  // Update dynamic styles
  update: function () {
    runtime.api.DOM.addStyle(`${runtime.meta.name}-vars`, `
      :root {
        --cui-transition-speed: ${settings.transitionSpeed}ms;
        --cui-collapse-size: ${settings.collapseSize}px;

        --cui-channel-list-width: ${settings.channelListWidth || settings.defaultChannelListWidth}px;
        --cui-members-list-width: ${settings.membersListWidth || settings.defaultMembersListWidth}px;
        --cui-user-profile-width: ${settings.userProfileWidth || settings.defaultUserProfileWidth}px;
        --cui-search-panel-width: ${settings.searchPanelWidth || settings.defaultSearchPanelWidth}px;
        --cui-forum-popout-width: ${settings.forumPopoutWidth || settings.defaultForumPopoutWidth}px;
        --cui-activity-panel-width: ${settings.activityPanelWidth || settings.defaultActivityPanelWidth}px;

        --cui-forum-panel-top: ${(elements.noChat) ? 0 : settings.toolbarHeight}px;
      }
    `.replace(/\s+/g, ' '));
  },

  // Remove and re-add some element styles
  reinit: function () {
    this.collapse.forEach((panel) => {
      if (panel._clear) {
        panel.clear();
        panel.init();
        if (!settings.buttonsActive[panel._index]) panel.toggle();
      }
    });
  },

  // Remove all added element styles
  clear: function () {
    // Clear root styles
    runtime.api.DOM.removeStyle(`${runtime.meta.name}-root`);
    runtime.api.DOM.removeStyle(`${runtime.meta.name}-vars`);

    // Clear panel styles
    this.collapse.forEach(panel => panel.clear());

    // Clear button group styles
    this.buttons.forEach(group => group.clear());
  },
};

// Export plugin class
module.exports = class CollapsibleUI {
  // Get api and metadata
  constructor(meta) {
    runtime.meta = meta;
    runtime.api = new BdApi(runtime.meta.name);
    runtime.plugin = this;
  }

  // Initialize the plugin when it is enabled
  start = () => {
    // Prevent load if plugin settings are old
    if (runtime.api.Data.load('settings-version')) {
      runtime.api.UI.showConfirmationModal('Fatal Error', `Your config file is incompatible with \
        this version of CollapsibleUI.\n\nPlease go to your BetterDiscord \
        plugins folder, delete the file \`CollapsibleUI.config.json\`, then \
        restart Discord.`, {
        danger: true,
        confirmText: (elements.bdPluginFolderButton) ? 'Open Plugins Folder' : 'Okay',
        onConfirm: () => elements.bdPluginFolderButton?.click(),
      });

      setTimeout(() => {
        runtime.api.UI.showToast('CollapsibleUI: Invalid Config Detected!', { type: 'error' });
        runtime.api.Plugins.disable(runtime.meta.name);
      }, 250);
    }

    // Notify user if plugin is outdated
    fetch('https://api.github.com/repos/programmer2514/BetterDiscord-CollapsibleUI/releases')
      .then(response => response.json())
      .then((data) => {
        if (runtime.api.Utils.semverCompare(data[0].tag_name.substring(1), runtime.meta.version) < 0) {
          runtime.api.Logger.warn('A newer version is available');
          runtime.notice = runtime.api.UI.showNotice(`Your version (v${runtime.meta.version}) \
            of CollapsibleUI is outdated and may be missing features! You can \
            either wait for v${data[0].tag_name.substring(1)} to be approved, \
            or download it manually.`, { timeout: '0' });
        }
      });

    // Show changelog modal if version has changed
    const savedVersion = runtime.api.Data.load('version');
    if (savedVersion !== runtime.meta.version) {
      runtime.api.UI.showChangelogModal(
        {
          title: runtime.meta.name,
          subtitle: runtime.meta.version,
          blurb: runtime.meta.description,
          changes: config.changelog,
        },
      );
      runtime.api.Data.save('version', runtime.meta.version);
    }

    // Subscribe dispatchers and listeners
    modules.dispatcher.subscribe('LAYER_POP', this.reload);

    this.addListeners();
    this.addIntervals();

    runtime.observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: false,
    });

    // Initialize the plugin
    this.initialize();
    runtime.api.Logger.info('Enabled');
  };

  // Restore the default UI when the plugin is disabled
  stop = () => {
    // If an update notice was shown, clear it
    if (runtime.notice) runtime.notice(true);

    // Unsubscribe dispatchers and listeners
    modules.dispatcher.unsubscribe('LAYER_POP', this.reload);

    runtime.controller.abort();

    clearInterval(runtime.interval);
    runtime.interval = null;

    runtime.observer.disconnect();

    this.terminate();
    runtime.api.Logger.info('Disabled');
  };

  // Re-inject the toolbar container when the page changes
  onSwitch = () => {
    this.createToolbarContainer();
    styles.reinit();
  };

  // Build settings panel
  getSettingsPanel = () => {
    return runtime.api.UI.buildSettingsPanel(
      {
        settings: config.settings,
        onChange: (_, id, value) => {
          let split = id.split('-');

          // Update regular settings
          if (split.length === 1) {
            settings[id] = value;
            return;
          }

          // Update resize settings
          if (split[0] === 'resizable') {
            switch (split[1]) {
              case 'channel':
                settings.channelListWidth = value ? settings.defaultChannelListWidth : 0;
                break;
              case 'members':
                settings.membersListWidth = value ? settings.defaultMembersListWidth : 0;
                break;
              case 'user':
                settings.userProfileWidth = value ? settings.defaultUserProfileWidth : 0;
                break;
              case 'search':
                settings.searchPanelWidth = value ? settings.defaultSearchPanelWidth : 0;
                break;
              case 'forum':
                settings.forumPopoutWidth = value ? settings.defaultForumPopoutWidth : 0;
                break;
              case 'activity':
                settings.activityPanelWidth = value ? settings.defaultActivityPanelWidth : 0;
                break;
            }
            return;
          }

          // Determine the index of the setting
          let index;
          switch (split[0]) {
            case 'server':
              index = constants.I_SERVER_LIST;
              break;
            case 'channel':
              index = constants.I_CHANNEL_LIST;
              break;
            case 'members':
              index = constants.I_MEMBERS_LIST;
              break;
            case 'user':
              if (split[1] === 'profile') index = constants.I_USER_PROFILE;
              else index = constants.I_USER_AREA;
              break;
            case 'message':
              index = constants.I_MESSAGE_INPUT;
              break;
            case 'window':
              index = constants.I_WINDOW_BAR;
              break;
            case 'call':
              index = constants.I_CALL_WINDOW;
              break;
            case 'search':
              index = constants.I_SEARCH_PANEL;
              break;
            case 'forum':
              index = constants.I_FORUM_POPOUT;
              break;
            case 'activity':
              index = constants.I_ACTIVITY_PANEL;
              break;
          }

          // Save the setting to the appropriate array
          if (id.slice(-9) === '-shortcut')
            this.updateSettingsArray('shortcutList', index, value);
          else if (id.slice(-13) === '-button-index')
            this.updateSettingsArray('buttonIndexes', index, parseInt(value));
          else if (id.slice(-16) === '-expand-on-hover')
            this.updateSettingsArray('expandOnHoverEnabled', index, value);
          else if (id.slice(-10) === '-threshold')
            this.updateSettingsArray('sizeCollapseThreshold', index, value);
          else if (id.slice(-12) === '-conditional')
            this.updateSettingsArray('collapseConditionals', index, value);
          else if (id.slice(-9) === '-floating')
            this.updateSettingsArray('floatingEnabled', index, value);
        },
      },
    );
  };

  // Initialize the plugin
  initialize = () => {
    styles.init();
    this.createToolbarContainer();
  };

  // Terminate the plugin
  terminate = () => {
    styles.clear();
    runtime.toolbar.remove();
  };

  // Reload the plugin
  reload = () => {
    this.terminate();
    this.initialize();
  };

  // Reload the toolbar after a short delay
  reloadToolbar = () => {
    setTimeout(() => {
      runtime.toolbar.remove();
      this.createToolbarContainer();
    }, 250);
  };

  // Reload the toolbar and reinit styles
  partialReload = () => {
    this.reloadToolbar();
    styles.reinit();
  };

  // Create the toolbar container and insert buttons
  createToolbarContainer = () => {
    // If the toolbar already exists, remove it
    runtime.toolbar?.remove();

    let toolbar = BdApi.DOM.parseHTML('<div class="cui-toolbar"></div>', true);

    // Insert the toolbar container into the correct spot
    try {
      if (elements.inviteToolbar || elements.searchBar) {
        elements.toolbar.insertBefore(toolbar, (elements.inviteToolbar)
          ? elements.inviteToolbar.nextElementSibling
          : elements.searchBar);
      }
      else
        elements.toolbar.insertBefore(toolbar, elements.toolbar.childNodes[elements.toolbar.childNodes.length - 2]);
    }
    catch (e) {
      elements.toolbar.appendChild(toolbar);
    }

    // Get toolbar container reference
    runtime.toolbar = document.querySelector('.cui-toolbar');

    // Insert toolbar buttons
    for (var i = 1; i <= settings.buttonIndexes.length; i++) {
      for (var j = 0; j < settings.buttonIndexes.length; j++) {
        if (i === settings.buttonIndexes[j] && elements.index[j])
          this.createToolbarButton(j);
      }
    }
  };

  // Create a functional toolbar button
  createToolbarButton = (index) => {
    // Get button text
    let text = locale.current[index] + ' (' + [...settings.shortcutList[index]].map(e => (e.length === 1 ? e.toUpperCase() : e)).join('+') + ')';

    // Create button and add it to the toolbar
    let button = BdApi.DOM.parseHTML(`
      <div id="cui-icon-${index}" class="${modules.icons?.iconWrapper} ${modules.icons?.clickable} ${settings.buttonsActive[index] ? modules.icons?.selected : ''}" role="button" aria-label="${text}" tabindex="0">
        <svg x="0" y="0" class="${modules.icons?.icon}" aria-hidden="false" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          ${icons[index]}
        </svg>
      </div>
    `, true);
    runtime.toolbar.appendChild(button);

    button = document.querySelector(`#cui-icon-${index}`);

    // Add tooltip and click handler
    runtime.api.UI.createTooltip(button, text, { side: 'bottom' });
    button.addEventListener('click', () => this.toggleButton(index));
  };

  // Update a single value in a settings array
  updateSettingsArray(array, index, value) {
    let temp = settings[array];
    temp[index] = value;
    settings[array] = temp;
  }

  // Toggles the button at the specified index
  toggleButton = (index) => {
    styles.collapse[index].toggle();
    runtime.toolbar.querySelector(`#cui-icon-${index}`)?.classList.toggle(modules.icons?.selected);
    this.updateSettingsArray('buttonsActive', index, !settings.buttonsActive[index]);
  };

  // Add event listeners to handle resize/expand on hover
  addListeners = () => {
    document.body.addEventListener('mousedown', (e) => {
      // Handle left clicks
      if (e.button === 0) {
        // Dynamically handle resizing elements
        if (e.target.classList.contains(modules.sidebar?.sidebar)
          || e.target.classList.contains(modules.members?.membersWrap)
          || e.target.classList.contains(modules.panel?.outer)
          || e.target.classList.contains(modules.search?.searchResultsWrap)
          || e.target.classList.contains(modules.popout?.chatLayerWrapper)
          || e.target.classList.contains(modules.social?.nowPlayingColumn)) {
          e.target.style.setProperty('transition', 'none', 'important');

          runtime.dragging = e.target;
        }

        if (e.target.classList.contains(modules.sidebar?.sidebar))
          document.querySelector(':root').style.setProperty('--cui-channel-list-handle-transition', 'none');
        if (e.target.classList.contains(modules.popout?.chatLayerWrapper)) {
          elements.chatWrapper?.style.setProperty('--transition', 'none');
          elements.noChat?.style.setProperty('--transition', 'none');
        }
      }
    }, { passive: true, signal: runtime.controller.signal });

    document.body.addEventListener('mouseup', (e) => {
      // Handle right clicks
      if (e.button === 2) {
        let target = null;

        // Reset channels list width
        if (e.target.classList.contains(modules.sidebar?.sidebar)) {
          settings.channelListWidth = settings.defaultChannelListWidth;
          target = e.target;
        }

        // Reset members list width
        if (e.target.classList.contains(modules.members?.membersWrap)) {
          settings.membersListWidth = settings.defaultMembersListWidth;
          target = e.target;
        }

        // Reset user profile width
        if (e.target.classList.contains(modules.panel?.outer)) {
          settings.userProfileWidth = settings.defaultUserProfileWidth;
          target = e.target;
        }

        // Reset search panel width
        if (e.target.classList.contains(modules.search?.searchResultsWrap)) {
          e.target.style.setProperty('transition', `max-width var(--cui-transition-speed), width var(--cui-transition-speed), min-width var(--cui-transition-speed)`, 'important');
          settings.searchPanelWidth = settings.defaultSearchPanelWidth;
          target = e.target;
        }

        // Reset activity panel width
        if (e.target.classList.contains(modules.social?.nowPlayingColumn)) {
          e.target.style.setProperty('transition', `max-width var(--cui-transition-speed), width var(--cui-transition-speed), min-width var(--cui-transition-speed)`, 'important');
          settings.activityPanelWidth = settings.defaultActivityPanelWidth;
          target = e.target;
        }

        // Reset forum popout width
        if (e.target.classList.contains(modules.popout?.chatLayerWrapper)) {
          e.target.style.setProperty('transition', `max-width var(--cui-transition-speed), width var(--cui-transition-speed), min-width var(--cui-transition-speed)`, 'important');
          settings.forumPopoutWidth = settings.defaultForumPopoutWidth;
          target = e.target;
        }

        if (target) {
          styles.update();
          // Timeout to provide smooth transition
          setTimeout(() => target.style.removeProperty('transition'), settings.transitionSpeed);
        }
      }

      // Handle left clicks
      else {
        let dragging = null;
        let target = null;
        if (runtime.dragging) {
          dragging = runtime.dragging;
          runtime.dragging = null;
        }
        else return;

        // Finish resizing the channels list
        if (dragging.classList.contains(modules.sidebar?.sidebar)) {
          settings.channelListWidth = parseInt(dragging.style.width);
          document.querySelector(':root').style.removeProperty('--cui-channel-list-handle-offset');
          document.querySelector(':root').style.removeProperty('--cui-channel-list-handle-transition');
          target = dragging;
        }

        // Finish resizing the members list
        if (dragging.classList.contains(modules.members?.membersWrap)) {
          settings.membersListWidth = parseInt(dragging.style.width);
          target = dragging;
        }

        // Finish resizing the user profile
        if (dragging.classList.contains(modules.panel?.outer)) {
          settings.userProfileWidth = parseInt(dragging.style.width);
          target = dragging;
        }

        // Finish resizing the search panel
        if (dragging.classList.contains(modules.search?.searchResultsWrap)) {
          settings.searchPanelWidth = parseInt(dragging.style.width);
          target = dragging;
        }

        // Finish resizing the activity panel
        if (dragging.classList.contains(modules.social?.nowPlayingColumn)) {
          settings.activityPanelWidth = parseInt(dragging.style.width);
          target = dragging;
        }

        // Finish resizing the forum popout
        if (dragging.classList.contains(modules.popout?.chatLayerWrapper)) {
          settings.forumPopoutWidth = parseInt(dragging.style.width);
          target = dragging;

          elements.chatWrapper?.style.removeProperty('--width');
          elements.noChat?.style.removeProperty('--width');
          // Timeout to avoid transition flash
          setTimeout(() => {
            elements.chatWrapper?.style.removeProperty('--transition');
            elements.noChat?.style.removeProperty('--transition');
          }, settings.transitionSpeed);
        }

        if (target) {
          target.style.removeProperty('width');
          target.style.removeProperty('max-width');
          target.style.removeProperty('min-width');

          styles.update();
          // Timeout to avoid transition flash
          setTimeout(() => target.style.removeProperty('transition'), settings.transitionSpeed);
        }
      }

      // Update expand on hover when the user clicks
      // Timeout to provide smooth transition
      setTimeout(() => runtime.plugin.tickExpandOnHover(e.clientX, e.clientY), settings.transitionSpeed);
    }, { passive: true, signal: runtime.controller.signal });

    document.body.addEventListener('mousemove', (e) => {
      runtime.plugin.tickExpandOnHover(e.clientX, e.clientY);
      runtime.plugin.tickCollapseSettings(e.clientX, e.clientY);
      runtime.plugin.tickMessageInputCollapse(e.clientX, e.clientY);
      runtime.plugin.tickCollapseToolbar(e.clientX, e.clientY, settings.collapseToolbar === 'all');

      if (!runtime.dragging) return;

      // Clamp width to between 1px and 80vw
      let width = runtime.dragging.classList.contains(modules.sidebar?.sidebar)
        ? e.clientX - runtime.dragging.getBoundingClientRect().left
        : runtime.dragging.getBoundingClientRect().right - e.clientX;
      if (width > window.innerWidth * 0.8)
        width = window.innerWidth * 0.8;
      else if (width < 1)
        width = 1;

      // Handle resizing members list/user profile/search panel/activity panel/forum popout
      if (runtime.dragging.classList.contains(modules.members?.membersWrap)
        || runtime.dragging.classList.contains(modules.panel?.outer)
        || runtime.dragging.classList.contains(modules.search?.searchResultsWrap)
        || runtime.dragging.classList.contains(modules.sidebar?.sidebar)
        || runtime.dragging.classList.contains(modules.social?.nowPlayingColumn)
        || runtime.dragging.classList.contains(modules.popout?.chatLayerWrapper)) {
        runtime.dragging.style.setProperty('width', `${width}px`, 'important');
        runtime.dragging.style.setProperty('max-width', `${width}px`, 'important');
        runtime.dragging.style.setProperty('min-width', `${width}px`, 'important');
      }

      if (runtime.dragging.classList.contains(modules.sidebar?.sidebar))
        document.querySelector(':root').style.setProperty('--cui-channel-list-handle-offset', `${width - 12}px`);

      if (runtime.dragging.classList.contains(modules.popout?.chatLayerWrapper)) {
        elements.chatWrapper?.style.setProperty('--width', `${width}px`);
        elements.noChat?.style.setProperty('--width', `${width}px`);
      }
    }, { passive: true, signal: runtime.controller.signal });

    document.body.addEventListener('mouseleave', (e) => {
      if (!runtime.plugin.isNear(elements.windowBar, settings.expandOnHoverFudgeFactor, e.clientX, e.clientY))
        runtime.plugin.tickExpandOnHover(NaN, NaN);
    }, { passive: true, signal: runtime.controller.signal });

    document.body.addEventListener('keydown', (e) => {
      // Handle keyboard shortcuts
      if (settings.keyboardShortcuts) {
        // Clear old logged keypresses if necessary
        if (Date.now() - runtime.lastKeypress > 1000)
          runtime.keys.clear();
        runtime.lastKeypress = Date.now();

        // Log keypress
        runtime.keys.add(e.key);
        runtime.plugin.tickKeyboardShortcuts();
      }
    }, { passive: true, signal: runtime.controller.signal });

    document.body.addEventListener('keyup', (e) => {
      // Delete logged keypress
      if (settings.keyboardShortcuts)
        runtime.keys.delete(e.key);
    }, { passive: true, signal: runtime.controller.signal });
  };

  // Add intervals to periodically check for changes
  addIntervals = () => {
    runtime.interval = setInterval(() => {
      // Wait for lazy-loaded threads module
      if ((!runtime.threadsLoaded) && modules.threads) {
        runtime.threadsLoaded = true;
        runtime.api.Logger.info('Loaded threads module');
        this.reload();
      }

      // Handle conditional collapse
      if (settings.conditionalCollapse) {
        this.tickConditionalCollapse();
      }
    }, 250);
  };

  // Update conditional collapse states
  tickConditionalCollapse = () => {
    for (let i = 0; i < styles.collapse.length; i++) {
      if (settings.collapseConditionals[i]) {
        if (eval(settings.collapseConditionals[i])) {
          if (!runtime.collapsed[i]) this.collapseElementDynamic(i, true);
        }
        else {
          if (runtime.collapsed[i]) this.collapseElementDynamic(i, false);
        }
      }
    }
  };

  // Check keyboard shortcut states
  tickKeyboardShortcuts = () => {
    for (let i = 0; i < styles.collapse.length; i++) {
      if (runtime.keys.symmetricDifference(settings.shortcutList[i]).size === 0)
        this.toggleButton(i);
    }
  };

  // Update dynamic collapsed state of elements
  tickExpandOnHover = (x, y) => {
    if (settings.expandOnHover) {
      for (let i = 0; i < styles.collapse.length; i++) {
        if (!settings.collapseDisabledButtons && settings.buttonIndexes[i] === 0)
          continue;

        if (settings.expandOnHoverEnabled[i] && (!settings.buttonsActive[i] || (settings.sizeCollapse && window.matchMedia(styles.collapse[i].query)).matches)) {
          if (this.isNear(elements.index[i], settings.expandOnHoverFudgeFactor, x, y)) {
            if (runtime.collapsed[i]) {
              if (settings.floatingPanels && settings.floatingEnabled[i] === 'hover')
                styles.collapse[i].float();
              this.collapseElementDynamic(i, false);
            }
          }
          else {
            if (!runtime.collapsed[i]) {
              if (elements.biteSizePanel
                || elements.rightClickMenu
                || elements.forumPreviewTooltip
                || elements.expressionPicker) {
                this.collapseElementDynamic(i, false);
              }
              else this.collapseElementDynamic(i, true);
            }
          }
        }
      }
    }
  };

  // Update dynamic collapsed state of user settings buttons
  tickCollapseSettings = (x, y) => {
    if (settings.collapseSettings) {
      if (this.isNear(elements.settingsContainer, settings.buttonCollapseFudgeFactor, x, y)) {
        if (styles.buttons[constants.I_SETTINGS_BUTTONS].hidden) styles.buttons[constants.I_SETTINGS_BUTTONS].show();
      }
      else {
        if (!styles.buttons[constants.I_SETTINGS_BUTTONS].hidden) styles.buttons[constants.I_SETTINGS_BUTTONS].hide();
      }
    }
  };

  // Update dynamic collapsed state of message input buttons
  tickMessageInputCollapse = (x, y) => {
    if (settings.messageInputCollapse) {
      if (this.isNear(elements.messageInputContainer, settings.buttonCollapseFudgeFactor, x, y)) {
        if (styles.buttons[constants.I_MESSAGE_INPUT_BUTTONS].hidden) styles.buttons[constants.I_MESSAGE_INPUT_BUTTONS].show();
      }
      else {
        if (!styles.buttons[constants.I_MESSAGE_INPUT_BUTTONS].hidden) styles.buttons[constants.I_MESSAGE_INPUT_BUTTONS].hide();
      }
    }
  };

  // Update dynamic collapsed state of toolbar buttons
  tickCollapseToolbar = (x, y, full) => {
    if (settings.collapseToolbar) {
      if (this.isNear(runtime.toolbar, settings.buttonCollapseFudgeFactor, x, y)
        && !this.isNear(elements.forumPopout, 0, x, y)) {
        if (styles.buttons[constants.I_TOOLBAR_BUTTONS].hidden) styles.buttons[constants.I_TOOLBAR_BUTTONS].show();
      }
      else {
        if (!styles.buttons[constants.I_TOOLBAR_BUTTONS].hidden) styles.buttons[constants.I_TOOLBAR_BUTTONS].hide();
      }
      if (full) {
        if (this.isNear(elements.toolbar, settings.buttonCollapseFudgeFactor, x, y)
          && !this.isNear(elements.forumPopout, 0, x, y)) {
          if (styles.buttons[constants.I_TOOLBAR_FULL].hidden) styles.buttons[constants.I_TOOLBAR_FULL].show();
        }
        else {
          if (!styles.buttons[constants.I_TOOLBAR_FULL].hidden) styles.buttons[constants.I_TOOLBAR_FULL].hide();
        }
      }
    }
  };

  // Check if the cursor is within the given distance of an element
  isNear = (element, distance, x, y) => {
    let box = element?.getBoundingClientRect();
    if (!box) return false;

    let top = box.top - distance;
    let left = box.left - distance;
    let right = box.right + distance;
    let bottom = box.bottom + distance;

    return (x > left && x < right && y > top && y < bottom);
  };

  // Update the dynamic collapsed state of an element
  collapseElementDynamic(index, collapsed) {
    if (collapsed) {
      if (settings.sizeCollapse && window.matchMedia(styles.collapse[index].query).matches) {
        runtime.api.DOM.removeStyle(styles.collapse[index]._queryToggle[0]);
        if (settings.floatingPanels && settings.floatingEnabled[index] === 'hover')
          if (styles.collapse[index]._float)
            setTimeout(() => runtime.api.DOM.removeStyle(styles.collapse[index]._float[0]), settings.transitionSpeed);
      }
      else
        runtime.api.DOM.addStyle(
          `${styles.collapse[index]._toggle[0]}_dynamic`,
          styles.collapse[index]._toggle[1],
        );
    }
    else {
      if (settings.sizeCollapse && window.matchMedia(styles.collapse[index].query).matches)
        runtime.api.DOM.addStyle(...styles.collapse[index]._queryToggle);
      else
        runtime.api.DOM.removeStyle(`${styles.collapse[index]._toggle[0]}_dynamic`);
    }
    runtime.collapsed[index] = collapsed;
  }
};
