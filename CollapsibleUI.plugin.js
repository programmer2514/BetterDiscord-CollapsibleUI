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
      let shortcuts = runtime.api.Data.load('shortcut-list') ?? [['Alt', 's'], ['Alt', 'c'], ['Alt', 'm'], ['Alt', 'p'], ['Alt', 'i'], ['Alt', 'w'], ['Alt', 'v'], ['Alt', 'u']];
      this._shortcutList = [
        new Set(shortcuts[0]),
        new Set(shortcuts[1]),
        new Set(shortcuts[2]),
        new Set(shortcuts[3]),
        new Set(shortcuts[4]),
        new Set(shortcuts[5]),
        new Set(shortcuts[6]),
        new Set(shortcuts[7]),
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
    ];
  },

  get collapseDisabledButtons() { return this._collapseDisabledButtons ?? (this._collapseDisabledButtons = runtime.api.Data.load('collapse-disabled-buttons') ?? false); },
  set collapseDisabledButtons(v) { runtime.api.Data.save('collapse-disabled-buttons', this._collapseDisabledButtons = v); },

  get buttonIndexes() { return this._buttonIndexes ?? (this._buttonIndexes = runtime.api.Data.load('button-indexes') ?? [1, 2, 4, 5, 3, 0, 6, 0]); },
  set buttonIndexes(v) { runtime.api.Data.save('button-indexes', this._buttonIndexes = v); },

  get expandOnHover() { return this._expandOnHover ?? (this._expandOnHover = runtime.api.Data.load('expand-on-hover') ?? true); },
  set expandOnHover(v) { runtime.api.Data.save('expand-on-hover', this._expandOnHover = v); },

  get floatingPanels() { return this._floatingPanels ?? (this._floatingPanels = runtime.api.Data.load('floating-panels') ?? true); },
  set floatingPanels(v) { runtime.api.Data.save('floating-panels', this._floatingPanels = v); },

  get expandOnHoverEnabled() { return this._expandOnHoverEnabled ?? (this._expandOnHoverEnabled = runtime.api.Data.load('expand-on-hover-enabled') ?? [true, true, true, true, true, true, true, true]); },
  set expandOnHoverEnabled(v) { runtime.api.Data.save('expand-on-hover-enabled', this._expandOnHoverEnabled = v); },

  get sizeCollapse() { return this._sizeCollapse ?? (this._sizeCollapse = runtime.api.Data.load('size-collapse') ?? false); },
  set sizeCollapse(v) { runtime.api.Data.save('size-collapse', this._sizeCollapse = v); },

  get sizeCollapseThreshold() { return this._sizeCollapseThreshold ?? (this._sizeCollapseThreshold = runtime.api.Data.load('size-collapse-threshold') ?? [500, 600, 950, 1200, 400, 200, 550, 400]); },
  set sizeCollapseThreshold(v) { runtime.api.Data.save('size-collapse-threshold', this._sizeCollapseThreshold = v); },

  get conditionalCollapse() { return this._conditionalCollapse ?? (this._conditionalCollapse = runtime.api.Data.load('conditional-collapse') ?? false); },
  set conditionalCollapse(v) { runtime.api.Data.save('conditional-collapse', this._conditionalCollapse = v); },

  get collapseConditionals() { return this._collapseConditionals ?? (this._collapseConditionals = runtime.api.Data.load('collapse-conditionals') ?? ['', '', '', '', '', '', '', '']); },
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

  get userAreaMaxHeight() { return this._userAreaMaxHeight ?? (this._userAreaMaxHeight = runtime.api.Data.load('user-area-max-height') ?? 300); },
  set userAreaMaxHeight(v) { runtime.api.Data.save('user-area-max-height', this._userAreaMaxHeight = v); },

  get messageInputMaxHeight() { return this._messageInputMaxHeight ?? (this._messageInputMaxHeight = runtime.api.Data.load('message-input-max-height') ?? 400); },
  set messageInputMaxHeight(v) { runtime.api.Data.save('message-input-max-height', this._messageInputMaxHeight = v); },

  get windowBarHeight() { return this._windowBarHeight ?? (this._windowBarHeight = runtime.api.Data.load('window-bar-height') ?? 18); },
  set windowBarHeight(v) { runtime.api.Data.save('window-bar-height', this._windowBarHeight = v); },

  get buttonsActive() { return this._buttonsActive ?? (this._buttonsActive = runtime.api.Data.load('buttons-active') ?? [true, true, true, true, true, true, true, true]); },
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
        'Switched away from direct DOM manipulation wherever possible',
        'Refactored style routines to reduce reliance on MutationObservers',
        'Plugin now caches settings and Webpack modules to decrease load times',
        'Settings update routines have been changed to reduce the number of disk writes',
        'Keyboard shortcuts can now be whatever you want and are not limited to standard patterns',
        'Size Collapse has been rewritten using media queries and now does not affect button states',
        'Expand on Hover is no longer a requirement for Size Collapse (though it is still recommended)',
        'Resizable panels can now be resized by clicking-and-dragging anywhere on the edge of the panel',
        'The activities panel in the friends list can now be resized',
        'The search/forum panels now float when floating panels is enabled',
        'Hovered panels will no longer collapse while a right-click menu is open',
        'Fixed showing multiple update notifications if plugin is toggled without reloading Discord',
        'Fixed inconsistent Size Collapse when snapping window dimensions in Windows',
        'Fixed panels jumping open during transitions on some low-end devices',
        'Fixed forum popup resizing inconsistently with other UI elements',
        'Improved out-of-the-box compatibility with other plugins',
        'Moved Unread DMs Badge feature to its own plugin',
        'Greatly increased plugin\'s overall performance',
        'Small visual tweaks for UI consistency',
        'Updated settings panel layout',
        'THIS UPDATE RESETS MANY OF YOUR SETTINGS TO DEFAULT',
        'TO MINIMIZE BUGS, PLEASE DELETE THE FILE "CollapsibleUI.config.json" IN YOUR PLUGINS FOLDER',
        'RE-WRITE MAY INTRODUCE REGRESSIONS - PLEASE REPORT ANY NEW ISSUES VIA GITHUB',
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
      shown: false,
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
          max: 8,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
          type: 'slider',
          id: 'channel-list-button-index',
          name: 'Channel List Button',
          note: 'Sets the order of the Channel List toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_CHANNEL_LIST]; },
          min: 0,
          max: 8,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
          type: 'slider',
          id: 'members-list-button-index',
          name: 'Members List Button',
          note: 'Sets the order of the Members List toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_MEMBERS_LIST]; },
          min: 0,
          max: 8,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
          type: 'slider',
          id: 'user-profile-button-index',
          name: 'User Profile Button',
          note: 'Sets the order of the User Profile toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_USER_PROFILE]; },
          min: 0,
          max: 8,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
          type: 'slider',
          id: 'message-input-button-index',
          name: 'Message Input Button',
          note: 'Sets the order of the Message Input toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_MESSAGE_INPUT]; },
          min: 0,
          max: 8,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
          type: 'slider',
          id: 'window-bar-button-index',
          name: 'Window Bar Button',
          note: 'Sets the order of the Window Bar toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_WINDOW_BAR]; },
          min: 0,
          max: 8,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
          type: 'slider',
          id: 'call-window-button-index',
          name: 'Call Window Button',
          note: 'Sets the order of the Call Window toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_CALL_WINDOW]; },
          min: 0,
          max: 8,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
          type: 'slider',
          id: 'user-area-button-index',
          name: 'User Area Button',
          note: 'Sets the order of the User Area toolbar button. Set to 0 to disable',
          get value() { return settings.buttonIndexes[constants.I_USER_AREA]; },
          min: 0,
          max: 8,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
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
          id: 'floatingPanels',
          name: 'Floating Panels',
          note: 'Expanded UI panels will float over other panels, instead of moving them out of the way',
          get value() { return settings.floatingPanels; },
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
          id: 'messageInputMaxHeight',
          name: 'Message Input - Max Height (px)',
          note: 'The maximum height of the Message Input when expanded',
          get value() { return settings.messageInputMaxHeight; },
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

// Locale labels
const locale = {
  'en': {
    serverList: 'Server List',
    channelList: 'Channel List',
    membersList: 'Members List',
    userProfile: 'User Profile',
    messageInput: 'Message Input',
    windowBar: 'Window Bar',
    callWindow: 'Call Window',
    userArea: 'User Area',
  },
  'da': {
    serverList: 'Serverliste',
    channelList: 'Kanalliste',
    membersList: 'Medlemsliste',
    userProfile: 'Brugerprofil',
    messageInput: 'Beskedindtastning',
    windowBar: 'Vinduestang',
    callWindow: 'Opkaldsvindue',
    userArea: 'Brugerområde',
  },
  'de': {
    serverList: 'Serverliste',
    channelList: 'Kanalliste',
    membersList: 'Mitgliederliste',
    userProfile: 'Benutzerprofil',
    messageInput: 'Nachrichteneingabe',
    windowBar: 'Fensterleiste',
    callWindow: 'Anruf-Fenster',
    userArea: 'Benutzerbereich',
  },
  'es-ES': {
    serverList: 'Lista de Servidores',
    channelList: 'Lista de Canales',
    membersList: 'Lista de Miembros',
    userProfile: 'Perfil de Usuario',
    messageInput: 'Entrada de Mensajes',
    windowBar: 'Barra de Ventanas',
    callWindow: 'Ventana de Llamada',
    userArea: 'Área de Usuario',
  },
  'es-419': {
    serverList: 'Lista de Servidores',
    channelList: 'Lista de Canales',
    membersList: 'Lista de Miembros',
    userProfile: 'Perfil de Usuario',
    messageInput: 'Entrada de Mensajes',
    windowBar: 'Barra de Ventanas',
    callWindow: 'Ventana de Llamada',
    userArea: 'Área de Usuario',
  },
  'fr': {
    serverList: 'Liste des Serveurs',
    channelList: 'Liste des Canaux',
    membersList: 'Liste des Membres',
    userProfile: 'Profil Utilisateur',
    messageInput: 'Champ de Saisie',
    windowBar: 'Barre de Fenêtres',
    callWindow: 'Fenêtre d\'Appel',
    userArea: 'Espace Utilisateur',
  },
  'hr': {
    serverList: 'Popis Poslužitelja',
    channelList: 'Popis Kanala',
    membersList: 'Popis Članova',
    userProfile: 'Profil Korisnika',
    messageInput: 'Polje za Unos',
    windowBar: 'Traka za Prozore',
    callWindow: 'Prozor Poziva',
    userArea: 'Korisnički Prostor',
  },
  'it': {
    serverList: 'Lista dei Server',
    channelList: 'Lista dei Canali',
    membersList: 'Lista dei Membri',
    userProfile: 'Profilo Utente',
    messageInput: 'Campo di Inserimento',
    windowBar: 'Barra delle Finestre',
    callWindow: 'Finestra di Chiamata',
    userArea: 'Area Utente',
  },
  'lt': {
    serverList: 'Serverio Sąrašas',
    channelList: 'Kanalų Sąrašas',
    membersList: 'Narių Sąrašas',
    userProfile: 'Naudotojo Profilis',
    messageInput: 'Žinutės Įvedimas',
    windowBar: 'Lango Juosta',
    callWindow: 'Skambučio Langas',
    userArea: 'Naudotojo Erdvė',
  },
  'hu': {
    serverList: 'Kiszolgálólista',
    channelList: 'Csatornalista',
    membersList: 'Taglista',
    userProfile: 'Felhasználói Profil',
    messageInput: 'Üzenetbeviteli mező',
    windowBar: 'Ablaksor',
    callWindow: 'Hívásablak',
    userArea: 'Felhasználói Terület',
  },
  'nl': {
    serverList: 'Serverlijst',
    channelList: 'Kanaallijst',
    membersList: 'Ledenlijst',
    userProfile: 'Gebruikersprofiel',
    messageInput: 'Berichtinvoer',
    windowBar: 'Vensterbalk',
    callWindow: 'Oproepvenster',
    userArea: 'Gebruikersgebied',
  },
  'no': {
    serverList: 'Serverliste',
    channelList: 'Kanalliste',
    membersList: 'Medlemsliste',
    userProfile: 'Brukerprofil',
    messageInput: 'Beskjedinnføring',
    windowBar: 'Vindusbjelke',
    callWindow: 'Anropsvindu',
    userArea: 'Brukerområde',
  },
  'pl': {
    serverList: 'Lista Serwerów',
    channelList: 'Lista Kanałów',
    membersList: 'Lista Członków',
    userProfile: 'Profil Użytkownika',
    messageInput: 'Pole Wiadomości',
    windowBar: 'Pasek Okien',
    callWindow: 'Okno Połączeń',
    userArea: 'Obszar Użytkownika',
  },
  'pt-BR': {
    serverList: 'Lista de Servidores',
    channelList: 'Lista de Canais',
    membersList: 'Lista de Membros',
    userProfile: 'Perfil do Usuário',
    messageInput: 'Campo de Mensagens',
    windowBar: 'Barra de Janelas',
    callWindow: 'Janela de Chamada',
    userArea: 'Área do Usuário',
  },
  'ro': {
    serverList: 'Lista Serverelor',
    channelList: 'Lista Canalelor',
    membersList: 'Lista Membrilor',
    userProfile: 'Profilul Utilizatorului',
    messageInput: 'Câmp de Mesaj',
    windowBar: 'Bara Ferestrelor',
    callWindow: 'Fereastra De Apel',
    userArea: 'Zona Utilizatorului',
  },
  'fi': {
    serverList: 'Palvelinluettelo',
    channelList: 'Kanavaluettelo',
    membersList: 'Jäsenluettelo',
    userProfile: 'Käyttäjäprofiili',
    messageInput: 'Viestin Syöttö',
    windowBar: 'Ikkunapalkki',
    callWindow: 'Puhelinikkuna',
    userArea: 'Käyttäjäalue',
  },
  'sv-SE': {
    serverList: 'Serverlista',
    channelList: 'Kanallista',
    membersList: 'Medlemslista',
    userProfile: 'Användarprofil',
    messageInput: 'Meddelandeinmatning',
    windowBar: 'Fönsterfält',
    callWindow: 'Samtalsfönster',
    userArea: 'Användarområde',
  },
  'vi': {
    serverList: 'Danh Sách Máy Chủ',
    channelList: 'Danh Sách Kênh',
    membersList: 'Danh Sách Thành Viên',
    userProfile: 'Hồ Sơ Người Dùng',
    messageInput: 'Nhập Tin Nhắn',
    windowBar: 'Thanh Cửa Sổ',
    callWindow: 'Cửa Sổ Cuộc Gọi',
    userArea: 'Khu Vực Người Dùng',
  },
  'tr': {
    serverList: 'Sunucu Listesi',
    channelList: 'Kanal Listesi',
    membersList: 'Üye Listesi',
    userProfile: 'Kullanıcı Profili',
    messageInput: 'Mesaj Girişi',
    windowBar: 'Pencere Çubuğu',
    callWindow: 'Arama Penceresi',
    userArea: 'Kullanıcı Alanı',
  },
  'cs': {
    serverList: 'Seznam Serverů',
    channelList: 'Seznam Kanálů',
    membersList: 'Seznam Členů',
    userProfile: 'Uživatelský Profil',
    messageInput: 'Vstup Zprávy',
    windowBar: 'Pás Oken',
    callWindow: 'Okno Hovorů',
    userArea: 'Uživatelská Oblast',
  },
  'el': {
    serverList: 'Λίστα Διακομιστών',
    channelList: 'Λίστα Καναλιών',
    membersList: 'Λίστα Μελών',
    userProfile: 'Προφίλ Χρήστη',
    messageInput: 'Πεδίο Μηνύματος',
    windowBar: 'Γραμμή Παραθύρων',
    callWindow: 'Παράθυρο Κλήσης',
    userArea: 'Περιοχή Χρήστη',
  },
  'bg': {
    serverList: 'Списък на Сървърите',
    channelList: 'Списък на Каналите',
    membersList: 'Списък на Членовете',
    userProfile: 'Профил на Потребителя',
    messageInput: 'Полет за съобщения',
    windowBar: 'Лента на Прозорците',
    callWindow: 'Прозорец на Обаждането',
    userArea: 'Потребителска Област',
  },
  'ru': {
    serverList: 'Список Серверов',
    channelList: 'Список Каналов',
    membersList: 'Список Участников',
    userProfile: 'Профиль Пользователя',
    messageInput: 'Ввод Сообщений',
    windowBar: 'Панель Окон',
    callWindow: 'Окно Вызова',
    userArea: 'Область Пользователя',
  },
  'uk': {
    serverList: 'Список Сервера',
    channelList: 'Список Каналів',
    membersList: 'Список Учасників',
    userProfile: 'Профіль Користувача',
    messageInput: 'Введення Повідомлень',
    windowBar: 'Панель Вікон',
    callWindow: 'Вікно Виклику',
    userArea: 'Область Користувача',
  },
  'hi': {
    serverList: 'सर्वर सूची',
    channelList: 'चैनल सूची',
    membersList: 'सदस्य सूची',
    userProfile: 'उपयोगकर्ता प्रोफ़ाइल',
    messageInput: 'संदेश प्रविष्टि',
    windowBar: 'विंडो बार',
    callWindow: 'कॉल विंडो',
    userArea: 'उपयोगकर्ता क्षेत्र',
  },
  'th': {
    serverList: 'รายชื่อเซิร์ฟเวอร์',
    channelList: 'รายชื่อช่อง',
    membersList: 'รายชื่อสมาชิก',
    userProfile: 'โปรไฟล์ผู้ใช้',
    messageInput: 'การป้อนข้อความ',
    windowBar: 'แถบหน้าต่าง',
    callWindow: 'หน้าต่างการโทร',
    userArea: 'พื้นที่ผู้ใช้',
  },
  'zh-CN': {
    serverList: '服务器列表',
    channelList: '频道列表',
    membersList: '成员列表',
    userProfile: '用户资料',
    messageInput: '消息输入',
    windowBar: '窗口栏',
    callWindow: '通话窗口',
    userArea: '用户区域',
  },
  'ja': {
    serverList: 'サーバーリスト',
    channelList: 'チャンネルリスト',
    membersList: 'メンバーリスト',
    userProfile: 'ユーザープロフィール',
    messageInput: 'メッセージ入力',
    windowBar: 'ウィンドウバー',
    callWindow: '通話ウィンドウ',
    userArea: 'ユーザーエリア',
  },
  'zh-TW': {
    serverList: '伺服器列表',
    channelList: '頻道列表',
    membersList: '成員列表',
    userProfile: '用戶資料',
    messageInput: '消息輸入',
    windowBar: '視窗欄',
    callWindow: '通話視窗',
    userArea: '用戶區域',
  },
  'ko': {
    serverList: '서버 목록',
    channelList: '채널 목록',
    membersList: '회원 목록',
    userProfile: '사용자 프로필',
    messageInput: '메시지 입력',
    windowBar: '윈도우 바',
    callWindow: '통화 창',
    userArea: '사용자 영역',
  },
  get 'current'() { return this[document.documentElement.getAttribute('lang')] ?? this.en; },
};

// Define icon paths
const icons = {
  serverList: '<path fill="currentColor" d="M18.9,2.5H5.1C2.8,2.5,1,4.3,1,6.6v10.8c0,2.3,1.8,4.1,4.1,4.1h13.7c2.3,0,4.1-1.8,4.1-4.1V6.6C23,4.3,21.2,2.5,18.9,2.5z M21.6,17.4c0,1.5-1.2,2.7-2.8,2.7H8.3c-1.5,0-2.7-1.2-2.7-2.7V6.6c0-1.5,1.2-2.7,2.8-2.7h10.5c1.5,0,2.8,1.2,2.8,2.7V17.4z"/>',
  channelList: '<path fill="currentColor" d="M4.1,12c0,0.9-0.7,1.6-1.6,1.6S1,12.9,1,12s0.7-1.6,1.6-1.6S4.1,11.1,4.1,12z M2.6,16.4c-0.9,0-1.6,0.7-1.6,1.6c0,0.9,0.7,1.6,1.6,1.6s1.6-0.7,1.6-1.6C4.1,17.1,3.4,16.4,2.6,16.4z M2.6,4.5C1.7,4.5,1,5.2,1,6.1s0.7,1.6,1.6,1.6s1.6-0.7,1.6-1.6S3.4,4.5,2.6,4.5z M7.4,7C7.5,7,7.5,7,7.4,7C7.5,7,7.5,7,7.4,7H22c0,0,0,0,0,0c0,0,0,0,0,0c0.6,0,1-0.4,1-1c0-0.5-0.4-1-1-1c0,0,0,0,0,0c0,0,0,0,0,0H7.5c0,0,0,0,0,0c0,0,0,0,0,0c-0.6,0-1,0.4-1,1C6.4,6.6,6.9,7,7.4,7z M7.4,13C7.5,13,7.5,13,7.4,13C7.5,13,7.5,13,7.4,13h9c0,0,0,0,0,0c0,0,0,0,0,0c0.6,0,1-0.4,1-1c0-0.5-0.4-1-1-1c0,0,0,0,0,0c0,0,0,0,0,0H7.5c0,0,0,0,0,0c0,0,0,0,0,0c-0.6,0-1,0.4-1,1C6.4,12.5,6.9,13,7.4,13z M7.4,18.9C7.5,18.9,7.5,18.9,7.4,18.9C7.5,18.9,7.5,18.9,7.4,18.9l12.4,0c0,0,0,0,0,0c0,0,0,0,0,0c0.6,0,1-0.4,1-1c0-0.5-0.4-1-1-1c0,0,0,0,0,0c0,0,0,0,0,0L7.5,17c0,0,0,0,0,0c0,0,0,0,0,0c-0.6,0-1,0.4-1,1C6.4,18.5,6.9,18.9,7.4,18.9z"/>',
  membersList: '<path fill="currentColor" d="M14.5 8a3 3 0 1 0-2.7-4.3c-.2.4.06.86.44 1.12a5 5 0 0 1 2.14 3.08c.01.06.06.1.12.1ZM18.44 17.27c.15.43.54.73 1 .73h1.06c.83 0 1.5-.67 1.5-1.5a7.5 7.5 0 0 0-6.5-7.43c-.55-.08-.99.38-1.1.92-.06.3-.15.6-.26.87-.23.58-.05 1.3.47 1.63a9.53 9.53 0 0 1 3.83 4.78ZM12.5 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2 20.5a7.5 7.5 0 0 1 15 0c0 .83-.67 1.5-1.5 1.5a.2.2 0 0 1-.2-.16c-.2-.96-.56-1.87-.88-2.54-.1-.23-.42-.15-.42.1v2.1a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2.1c0-.25-.31-.33-.42-.1-.32.67-.67 1.58-.88 2.54a.2.2 0 0 1-.2.16A1.5 1.5 0 0 1 2 20.5Z"/>',
  userProfile: '<path fill="currentColor" fill-rule="evenodd" d="M23 12.38c-.02.38-.45.58-.78.4a6.97 6.97 0 0 0-6.27-.08.54.54 0 0 1-.44 0 8.97 8.97 0 0 0-11.16 3.55c-.1.15-.1.35 0 .5.37.58.8 1.13 1.28 1.61.24.24.64.15.8-.15.19-.38.39-.73.58-1.02.14-.21.43-.1.4.15l-.19 1.96c-.02.19.07.37.23.47A8.96 8.96 0 0 0 12 21a.4.4 0 0 1 .38.27c.1.33.25.65.4.95.18.34-.02.76-.4.77L12 23a11 11 0 1 1 11-10.62ZM15.5 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd"></path><path fill="currentColor" d="M24 19a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"></path>',
  messageInput: '<path fill="currentColor" d="M7.5,3c0-0.4,0.3-0.8,0.8-0.8c1.3,0,2.4,0.4,3.1,0.8c0.3,0.1,0.5,0.3,0.7,0.4c0.2-0.1,0.4-0.3,0.7-0.4c0.9-0.5,2-0.8,3.1-0.8c0.4,0,0.8,0.3,0.8,0.8c0,0.4-0.3,0.8-0.8,0.8c-1,0-1.8,0.3-2.3,0.7c-0.2,0.1-0.4,0.3-0.7,0.4v6.4h0.8c0.4,0,0.8,0.3,0.8,0.8c0,0.4-0.3,0.8-0.8,0.8h-0.8v6.4c0.1,0.1,0.4,0.3,0.7,0.4c0.6,0.3,1.4,0.6,2.3,0.6c0.4,0,0.8,0.3,0.8,0.8c0,0.4-0.3,0.8-0.8,0.8c-1.1,0-2.1-0.3-3.1-0.9c-0.2-0.1-0.4-0.3-0.7-0.4c-0.2,0.2-0.4,0.3-0.7,0.4c-0.9,0.5-2,0.8-3.1,0.8c-0.4,0-0.8-0.3-0.8-0.8c0-0.4,0.3-0.8,0.8-0.8c1,0,1.8-0.3,2.3-0.7c0.3-0.2,0.5-0.3,0.7-0.4v-6.4h-0.8c-0.4,0-0.8-0.3-0.8-0.8c0-0.4,0.3-0.8,0.8-0.8h0.8V4.8c-0.2-0.2-0.4-0.3-0.7-0.4C9.9,4,9.1,3.8,8.2,3.8C7.8,3.8,7.5,3.4,7.5,3z"/><path fill="currentColor" d="M15.7,7.5h4.5c1.2,0,2.2,1,2.2,2.2v4.5c0,1.2-1,2.2-2.2,2.2h-4.5c-0.4,0-0.7,0.3-0.7,0.8l0,0c0,0.4,0.3,0.8,0.7,0.8h4.5c2.1,0,3.8-1.7,3.8-3.7V9.7C24,7.7,22.3,6,20.2,6h-4.5C15.3,6,15,6.3,15,6.7v0C15,7.2,15.3,7.5,15.7,7.5z M9,6.8L9,6.8C9,6.3,8.7,6,8.3,6H3.7C1.7,6,0,7.7,0,9.7v4.5C0,16.3,1.7,18,3.7,18h4.5C8.7,18,9,17.7,9,17.2l0,0c0-0.4-0.3-0.8-0.7-0.8H3.7c-1.2,0-2.2-1-2.2-2.2V9.7c0-1.2,1-2.2,2.2-2.2h4.5C8.7,7.5,9,7.2,9,6.8z"/>',
  windowBar: '<path fill="currentColor" d="M22.3,4.3C22,3.8,21.5,3.4,21,3.1c-0.6-0.4-1.4-0.6-2.2-0.6H5.1C4.3,2.5,3.6,2.7,3,3.1C2.6,3.3,2.2,3.6,1.9,4C1.3,4.7,1,5.6,1,6.6v10.9c0,2.2,1.8,4.1,4.1,4.1h13.7c2.3,0,4.1-1.8,4.1-4.1V6.6C23,5.7,22.8,5,22.3,4.3z M10.5,3.6c0.5,0,0.9,0.4,0.9,0.9c0,0.5-0.4,0.9-0.9,0.9c-0.5,0-1-0.4-1-0.9C9.5,4,9.9,3.6,10.5,3.6z M7.6,3.6c0.5,0,0.9,0.4,0.9,0.9c0,0.5-0.4,0.9-0.9,0.9c-0.5,0-1-0.4-1-0.9C6.7,4,7.1,3.6,7.6,3.6z M4.8,3.6c0.5,0,1,0.4,1,0.9c0,0.5-0.4,0.9-1,0.9c-0.5,0-0.9-0.4-0.9-0.9C3.9,4,4.3,3.6,4.8,3.6z M21.6,17.4c0,0.7-0.3,1.4-0.8,1.9c-0.1,0.1-0.1,0.1-0.2,0.2c-0.1,0.1-0.1,0.1-0.2,0.2c-0.2,0.2-0.5,0.3-0.7,0.3c-0.3,0.1-0.5,0.1-0.8,0.1H5.1c-0.3,0-0.6,0-0.8-0.1c-0.3-0.1-0.5-0.2-0.7-0.3c-0.1,0-0.2-0.1-0.2-0.2c-0.1-0.1-0.1-0.1-0.2-0.2c-0.5-0.5-0.8-1.2-0.8-1.9V9.3c0-1.5,1.2-2.8,2.8-2.8h13.8c1.5,0,2.7,1.2,2.7,2.7V17.4z"/>',
  callWindow: '<path fill="currentColor" d="M20.7,16.2c-0.1-0.1-0.2-0.2-0.3-0.2c-0.5-0.4-1-0.8-1.6-1.1l-0.3-0.2c-0.7-0.5-1.3-0.7-1.8-0.7c-0.8,0-1.4,0.4-2,1.2c-0.2,0.4-0.5,0.5-0.9,0.5c-0.3,0-0.5-0.1-0.7-0.2c-2.2-1-3.7-2.5-4.6-4.4C8,10.2,8.2,9.5,8.9,9c0.4-0.3,1.2-0.8,1.2-1.8C10,6,7.4,2.5,6.3,2.1C5.9,2,5.4,2,4.9,2.1C3.7,2.5,2.8,3.3,2.3,4.2c-0.4,0.9-0.4,2,0.1,3.2C3.7,10.7,5.6,13.6,8,16c2.4,2.3,5.2,4.2,8.6,5.7c0.3,0.1,0.6,0.2,0.9,0.3c0.1,0,0.1,0,0.2,0c0,0,0.1,0,0.1,0h0c1.6,0,3.5-1.4,4.1-3.1C22.4,17.5,21.4,16.8,20.7,16.2z"/>',
  userArea: '<path fill="currentColor" d="M21.2,7.6H2.8C1.3,7.6,0,8.8,0,10.3v3.3c0,1.5,1.3,2.8,2.8,2.8h18.4c1.5,0,2.8-1.3,2.8-2.8v-3.3C24,8.8,22.7,7.6,21.2,7.6z M17.4,10.7c0.7,0,1.3,0.6,1.3,1.3s-0.6,1.3-1.3,1.3s-1.3-0.6-1.3-1.3S16.7,10.7,17.4,10.7z M3.9,10.1c1.1,0,1.9,0.9,1.9,1.9S5,13.9,3.9,13.9S2,13.1,2,12S2.9,10.1,3.9,10.1z M20.7,10.7c0.7,0,1.3,0.6,1.3,1.3s-0.6,1.3-1.3,1.3s-1.3-0.6-1.3-1.3S20,10.7,20.7,10.7z M6.5,10.8C6.5,10.8,6.5,10.8,6.5,10.8c0-0.4,0.3-0.7,0.8-0.7h6.3c0.4,0,0.7,0.3,0.8,0.7c0,0,0,0,0,0v0c0,0.4-0.3,0.8-0.8,0.8H7.2C6.8,11.6,6.5,11.2,6.5,10.8L6.5,10.8z M7.2,12.4h6.3c0.4,0,0.8,0.3,0.8,0.8c0,0,0,0,0,0.1c0,0.4-0.4,0.7-0.7,0.7H7.2c-0.4,0-0.7-0.3-0.7-0.7c0,0,0,0,0-0.1C6.5,12.8,6.8,12.4,7.2,12.4z"/>',
};

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
  I_SEARCH_PANEL: 0,
  I_FORUM_POPOUT: 1,
};

// Abstract webpack modules
const modules = {
  get members() { return this._members ?? (this._members = runtime.api.Webpack.getByKeys('membersWrap', 'hiddenMembers', 'roleIcon')); },
  get icons() { return this._icons ?? (this._icons = runtime.api.Webpack.getByKeys('selected', 'iconWrapper', 'clickable', 'icon')); },
  get member() { return this._member ?? (this._member = runtime.api.Webpack.getByKeys('member', 'ownerIcon', 'activityText', 'clanTag')); },
  get dispatcher() { return this._dispatcher ?? (this._dispatcher = runtime.api.Webpack.getByKeys('dispatch', 'isDispatching')); },
  get social() { return this._social ?? (this._social = runtime.api.Webpack.getByKeys('inviteToolbar', 'peopleColumn', 'addFriend')); },
  get toolbar() { return this._toolbar ?? (this._toolbar = runtime.api.Webpack.getByKeys('updateIconForeground', 'search', 'forumOrHome')); },
  get panel() { return this._panel ?? (this._panel = runtime.api.Webpack.getByKeys('biteSize', 'fullSize', 'panel', 'outer', 'inner', 'overlay')); },
  get guilds() { return this._guilds ?? (this._guilds = runtime.api.Webpack.getByKeys('chatContent', 'noChat', 'parentChannelName', 'linkedLobby')); },
  get frame() { return this._frame ?? (this._frame = runtime.api.Webpack.getByKeys('typeMacOS', 'typeWindows', 'withBackgroundOverride')); },
  get callWindow() { return this._callWindow ?? (this._callWindow = runtime.api.Webpack.getByKeys('wrapper', 'fullScreen', 'callContainer')); },
  get threads() { return this._threads ?? (this._threads = runtime.api.Webpack.getByKeys('uploadArea', 'newMemberBanner', 'mainCard', 'newPostsButton')); },
  get user() { return this._user ?? (this._user = runtime.api.Webpack.getByKeys('avatar', 'nameTag', 'customStatus', 'emoji', 'buttons')); },
  get layout() { return this._layout ?? (this._layout = runtime.api.Webpack.getByKeys('flex', 'horizontal', 'flexChild')); },
  get input() { return this._input ?? (this._input = runtime.api.Webpack.getByKeys('channelTextArea', 'accessoryBar', 'emojiButton')); },
  get popout() { return this._popout ?? (this._popout = runtime.api.Webpack.getByKeys('container', 'floating', 'chatTarget')); },
  get sidebar() { return this._sidebar ?? (this._sidebar = runtime.api.Webpack.getByKeys('sidebar', 'activityPanel', 'sidebarListRounded')); },
  get servers() { return this._servers ?? (this._servers = runtime.api.Webpack.getByKeys('wrapper', 'unreadMentionsIndicatorTop', 'discoveryIcon')); },
  get effects() { return this._effects ?? (this._effects = runtime.api.Webpack.getByKeys('profileEffects', 'hovered', 'effect')); },
  get search() { return this._search ?? (this._search = runtime.api.Webpack.getByKeys('searchResultsWrap', 'stillIndexing', 'noResults')); },
  get tooltip() { return this._tooltip ?? (this._tooltip = runtime.api.Webpack.getByKeys('menu', 'label', 'caret')); },
};

const elements = {
  get inviteToolbar() { return document.querySelector(`.${modules.social?.inviteToolbar}`); },
  get searchBar() { return document.querySelector(`.${modules.toolbar?.search}`); },
  get toolbar() { return document.querySelector(`.${modules.icons?.toolbar}`); },
  get membersList() { return document.querySelector(`.${modules.members?.membersWrap}`); },
  get userProfile() { return document.querySelector(`.${modules.panel?.inner}.${modules.panel?.panel}`); },
  get messageInput() { return document.querySelector(`.${modules.guilds?.form}`); },
  get windowBar() { return document.querySelector(`.${modules.frame?.typeWindows.split(' ')[2]}`); },
  get callWindow() { return document.querySelector(`.${modules.callWindow?.wrapper}:not(.${modules.callWindow?.noChat})`); },
  get settingsContainer() { return document.querySelector(`.${modules.user?.container} .${modules.layout?.flex}`); },
  get messageInputContainer() { return document.querySelector(`.${modules.input?.buttons}`); },
  get forumPopout() { return document.querySelector(`.${modules.popout?.floating}:not(.${modules.popout?.chatTarget.split(' ')[0]})`); },
  get biteSizePanel() { return document.querySelector(`.${modules.panel?.outer}.${modules.panel?.biteSize}`); },
  get userArea() { return document.querySelector(`.${modules.sidebar?.panels}`); },
  get serverList() { return document.querySelector(`.${modules.servers?.wrapper}`); },
  get channelList() { return document.querySelector(`.${modules.sidebar?.sidebar}`); },
  get rightClickMenu() { return document.querySelector(`.${modules.tooltip?.menu}`); },
  get popoutSpacer() { return document.querySelector(`div:not([class])[style^="min-width"]`); },
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
  collapsed: [false, false, false, false, false, false, false, false],
  keys: new Set(),
  lastKeypress: Date.now(),
  get controller() {
    if (this._controller && this._controller.signal.aborted) this._controller = null;
    return this._controller ?? (this._controller = new AbortController());
  },
  get observer() {
    return this._observer ?? (this._observer = new MutationObserver((mutationList) => {
      mutationList.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.classList?.contains(modules.panel?.outer)
            || node.classList?.contains(modules.search?.searchResultsWrap)) {
            this.plugin.reloadToolbar();
            styles.reinit();
          }
        });
        mutation.removedNodes.forEach((node) => {
          if (node.classList?.contains(modules.panel?.outer)
            || node.classList?.contains(modules.search?.searchResultsWrap)) {
            this.plugin.reloadToolbar();
            styles.reinit();
          }
        });
      });
    }));
  },
};

// Abstract stylesheet application
const styleFunctions = {
  _toggled: true,
  init: function () {
    runtime.api.DOM.addStyle(...this._init);
  },
  toggle: function () {
    if (!settings.collapseDisabledButtons && settings.buttonIndexes[this._index] === 0) {
      this._toggled = !this._toggled;
      return;
    }
    if ((!settings.expandOnHover) || (!settings.expandOnHoverEnabled[this._index])) {
      if (this._toggled) runtime.api.DOM.addStyle(...this._toggle);
      else runtime.api.DOM.removeStyle(this._toggle[0]);
    }
    else {
      if (this._toggled) {
        runtime.api.DOM.addStyle(`${this._toggle[0]}_dynamic`, this._toggle[1]);
        if (settings.floatingPanels) runtime.api.DOM.addStyle(...this._float);
      }
      else {
        runtime.api.DOM.removeStyle(`${this._toggle[0]}_dynamic`);
        if (settings.floatingPanels) runtime.api.DOM.removeStyle(this._float[0]);
      }
    }
    this._toggled = !this._toggled;
  },
  float: function () {
    if (this._float) runtime.api.DOM.addStyle(...this._float);
  },
  clear: function () {
    runtime.api.DOM.removeStyle(this._init[0]);
    if (this._toggle) runtime.api.DOM.removeStyle(this._toggle[0]);
    if (this._float) runtime.api.DOM.removeStyle(this._float[0]);
    if (this._clear) this._clear();
    this._toggled = true;
  },
};

const styles = {
  buttons: [
    {
      _index: constants.I_SERVER_LIST,
      get _init() {
        return [`${runtime.meta.name}-serverList_init`, `
        
        `];
      },
      get _toggle() {
        return [`${runtime.meta.name}-serverList_toggle`, `
        
        `];
      },
      get _float() {
        return [`${runtime.meta.name}-serverList_float`, `
        
        `];
      },
      get query() { return ``; },
      get _queryToggle() {
        return [`${runtime.meta.name}-serverList_queryToggle`, `
        
        `];
      },
      ...styleFunctions,
    },
    {
      _index: constants.I_CHANNEL_LIST,
      get _init() {
        return [`${runtime.meta.name}-channelList_init`, `
        
        `];
      },
      get _toggle() {
        return [`${runtime.meta.name}-channelList_toggle`, `
        
        `];
      },
      get _float() {
        return [`${runtime.meta.name}-channelList_float`, `
        
        `];
      },
      get query() { return ``; },
      get _queryToggle() {
        return [`${runtime.meta.name}-channelList_queryToggle`, `
        
        `];
      },
      ...styleFunctions,
    },
    {
      _index: constants.I_MEMBERS_LIST,
      get _init() {
        return [`${runtime.meta.name}-membersList_init`, `
          .${modules.members?.membersWrap} {
            max-width: ${settings.membersListWidth || settings.defaultMembersListWidth}px !important;
            width: ${settings.membersListWidth || settings.defaultMembersListWidth}px !important;
            min-width: 1px !important;
            transition: max-width ${settings.transitionSpeed}ms, width ${settings.transitionSpeed}ms, padding ${settings.transitionSpeed}ms;
            overflow: hidden !important;
            flex-basis: auto !important;
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
                width: 8px;
                height: 100%;
                left: 0;
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
        `];
      },
      get _toggle() {
        return [`${runtime.meta.name}-membersList_toggle`, `
          .${modules.members?.membersWrap} {
            max-width: ${settings.collapseSize}px !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
        `];
      },
      get _float() {
        return [`${runtime.meta.name}-membersList_float`, `
          .${modules.members?.membersWrap} {
            position: absolute !important;
            z-index: 190 !important;
            max-height: 100% !important;
            height: 100% !important;
            right: 0 !important;
          }
          .${modules.members?.membersWrap}:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: rgba(0, 0, 0, 0.05);
            border-top: 1px solid rgba(0, 0, 0, 0.15);
          }
        `];
      },
      get query() { return `(max-width: ${settings.sizeCollapseThreshold[constants.I_MEMBERS_LIST]}px)`; },
      get _queryToggle() {
        return [`${runtime.meta.name}-membersList_queryToggle`, `
          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                .${modules.members?.membersWrap} {
                  max-width: ${settings.membersListWidth || settings.defaultMembersListWidth}px !important;
                }
              }
            `
            : ''}
        `];
      },
      ...styleFunctions,
    },
    {
      _index: constants.I_USER_PROFILE,
      get _init() {
        if (document.querySelector(`.${modules.panel?.outer} header > svg`)) document.querySelector(`.${modules.panel?.outer} header > svg`).style.maxHeight = document.querySelector(`.${modules.panel?.outer} header > svg`).style.minHeight;
        document.querySelector(`.${modules.panel?.outer} header > svg > mask > rect`)?.setAttribute('width', '500%');
        document.querySelector(`.${modules.panel?.outer} header > svg`)?.removeAttribute('viewBox');
        return [`${runtime.meta.name}-userProfile_init`, `
          .${modules.panel?.outer}.${modules.panel?.panel} {
            max-width: ${settings.userProfileWidth || settings.defaultUserProfileWidth}px !important;
            width: ${settings.userProfileWidth || settings.defaultUserProfileWidth}px !important;
            min-width: 1px !important;
            transition: max-width ${settings.transitionSpeed}ms, width ${settings.transitionSpeed}ms;
            overflow: hidden !important;
            flex-basis: auto !important;
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
                width: 8px;
                height: 100%;
                left: 0;
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
        `];
      },
      get _toggle() {
        return [`${runtime.meta.name}-userProfile_toggle`, `
          .${modules.panel?.outer}.${modules.panel?.panel} {
            max-width: ${settings.collapseSize}px !important;
          }
        `];
      },
      get _float() {
        return [`${runtime.meta.name}-userProfile_float`, `
          .${modules.panel?.outer}.${modules.panel?.panel} {
            position: absolute !important;
            z-index: 190 !important;
            max-height: 100% !important;
            height: 100% !important;
            right: 0 !important;
          }
          .${modules.panel?.outer}.${modules.panel?.panel}:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: rgba(0, 0, 0, 0.05);
            border-top: 1px solid rgba(0, 0, 0, 0.15);
          }
        `];
      },
      get query() { return `(max-width: ${settings.sizeCollapseThreshold[constants.I_USER_PROFILE]}px)`; },
      get _queryToggle() {
        return [`${runtime.meta.name}-userProfile_queryToggle`, `
          ${(settings.sizeCollapse)
            ? `
              @media ${this.query} {
                .${modules.panel?.outer}.${modules.panel?.panel} {
                  max-width: ${settings.userProfileWidth || settings.defaultUserProfileWidth}px !important;
                }
              }
            `
            : ''}
        `];
      },
      _clear: function () {
        document.querySelector(`.${modules.panel?.outer} header > svg`)?.style.removeProperty('max-height');
        document.querySelector(`.${modules.panel?.outer} header > svg > mask > rect`)?.setAttribute('width', '100%');
        document.querySelector(`.${modules.panel?.outer} header > svg`)?.setAttribute('viewBox', `0 0 ${parseInt(document.querySelector(`.${modules.panel?.outer} header > svg`)?.style.minWidth)} ${parseInt(document.querySelector(`.${modules.panel?.outer} header > svg`)?.style.minHeight)}`);
      },
      ...styleFunctions,
    },
    {
      _index: constants.I_MESSAGE_INPUT,
      get _init() {
        return [`${runtime.meta.name}-messageInput_init`, `
        
        `];
      },
      get _toggle() {
        return [`${runtime.meta.name}-messageInput_toggle`, `
        
        `];
      },
      get _float() {
        return [`${runtime.meta.name}-messageInput_float`, `
        
        `];
      },
      get query() { return ``; },
      get _queryToggle() {
        return [`${runtime.meta.name}-messageInput_queryToggle`, `
        
        `];
      },
      ...styleFunctions,
    },
    {
      _index: constants.I_WINDOW_BAR,
      get _init() {
        return [`${runtime.meta.name}-windowBar_init`, `

        `];
      },
      get _toggle() {
        return [`${runtime.meta.name}-windowBar_toggle`, `

        `];
      },
      get query() { return ``; },
      get _queryToggle() {
        return [`${runtime.meta.name}-windowBar_queryToggle`, `
        
        `];
      },
      ...styleFunctions,
    },
    {
      _index: constants.I_CALL_WINDOW,
      get _init() {
        return [`${runtime.meta.name}-callWindow_init`, `

        `];
      },
      get _toggle() {
        return [`${runtime.meta.name}-callWindow_toggle`, `

        `];
      },
      get query() { return ``; },
      get _queryToggle() {
        return [`${runtime.meta.name}-callWindow_queryToggle`, `
        
        `];
      },
      ...styleFunctions,
    },
    {
      _index: constants.I_USER_AREA,
      get _init() {
        return [`${runtime.meta.name}-userArea_init`, `

        `];
      },
      get _toggle() {
        return [`${runtime.meta.name}-userArea_toggle`, `

        `];
      },
      get query() { return ``; },
      get _queryToggle() {
        return [`${runtime.meta.name}-userArea_queryToggle`, `
        
        `];
      },
      ...styleFunctions,
    },
  ],
  resize: [
    {
      get _init() {
        return [`${runtime.meta.name}-searchPanel_init`, `
          .${modules.search?.searchResultsWrap} {
            max-width: ${settings.searchPanelWidth || settings.defaultSearchPanelWidth}px !important;
            width: ${settings.searchPanelWidth || settings.defaultSearchPanelWidth}px !important;
            min-width: 1px !important;
            overflow: hidden !important;
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
                width: 8px;
                height: 100%;
                left: 0;
              }
            `
            : ''}
        `];
      },
      get _float() {
        return [`${runtime.meta.name}-searchPanel_float`, `
          .${modules.search?.searchResultsWrap} {
            position: absolute !important;
            z-index: 190 !important;
            max-height: 100% !important;
            height: 100% !important;
            right: 0 !important;
          }
          .${modules.search?.searchResultsWrap}:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: rgba(0, 0, 0, 0.05);
            border-top: 1px solid rgba(0, 0, 0, 0.15);
          }
        `];
      },
      ...styleFunctions,
    },
    {
      get _init() {
        return [`${runtime.meta.name}-forumPopout_init`,
          (elements.popoutSpacer)
            ? `
              .${modules.popout?.chatLayerWrapper},
              div:not([class])[style^="min-width"] {
                max-width: ${settings.forumPopoutWidth || settings.defaultForumPopoutWidth}px !important;
                width: ${settings.forumPopoutWidth || settings.defaultForumPopoutWidth}px !important;
                min-width: 1px !important;
                //overflow: hidden !important;
              }
              .${modules.popout?.resizeHandle} {
                display: none !important;
              }
              .${modules.popout?.chatLayerWrapper} > * {
                width: calc(100% - 8px) !important;
              }
              .${modules.guilds.threadSidebarOpen} {
                flex-shrink: 999999999 !important;
              }

              ${(settings.forumPopoutWidth)
                ? `
                  .${modules.popout?.chatLayerWrapper}:before {
                    cursor: e-resize;
                    z-index: 200;
                    position: absolute;
                    content: "";
                    width: 8px;
                    height: 100%;
                    left: 0;
                  }
                `
                : ''}
            `
            : `
              .${modules.popout?.floating}:not(.${modules.popout?.chatTarget.split(' ')[0]}) {
                max-width: ${settings.forumPopoutWidth || settings.defaultForumPopoutWidth}px !important;
                width: ${settings.forumPopoutWidth || settings.defaultForumPopoutWidth}px !important;
                min-width: 1px !important;
                overflow: hidden !important;
              }

              .${modules.popout?.chatTarget.split(' ')[0]} {
                display: none !important;
              }

              ${(settings.forumPopoutWidth)
                ? `
                  .${modules.popout?.floating}:not(.${modules.popout?.chatTarget.split(' ')[0]}):before {
                    cursor: e-resize;
                    z-index: 200;
                    position: absolute;
                    content: "";
                    width: 8px;
                    height: 100%;
                    left: 0;
                  }
                `
                : ''}
            `];
      },
      get _float() {
        return [`${runtime.meta.name}-forumPopout_float`,
          (elements.popoutSpacer)
            ? `
              .${modules.popout?.chatLayerWrapper} {
                z-index: 190 !important;
                filter: drop-shadow(-8px 0px 0px var(--background-tertiary));
              }
              div:not([class])[style^="min-width"] {
                display: none !important;
              }
              .${modules.popout?.chatLayerWrapper}:after {
                content: "";
                width: 32px;
                height: 100%;
                position: absolute;
                z-index: -1;
                top: 0;
                left: 0;
                transform: translateX(-32px) translateY(-8px);
                border: 8px solid var(--background-tertiary);
                border-radius: 16px;
                clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
              }
            `
            : ''];
      },
      ...styleFunctions,
    },
  ],
  settings: {
    hidden: false,
    init: function () {
      runtime.api.DOM.addStyle(`${runtime.meta.name}-settings_init_col`, `
        .${modules.user?.container} .${modules.layout?.flex} > *:not(:last-child) {
          transition: width ${settings.transitionSpeed}ms !important;
          overflow: hidden !important;
        }
      `);
      if (settings.collapseSettings) this.hide();
    },
    hide: function () {
      runtime.api.DOM.addStyle(`${runtime.meta.name}-settings_hide_col`, `
        .${modules.user?.container} .${modules.layout?.flex} > *:not(:last-child) {
          width: 0px !important;
        }
      `);
      this.hidden = true;
    },
    show: function () {
      runtime.api.DOM.removeStyle(`${runtime.meta.name}-settings_hide_col`);
      this.hidden = false;
    },
    clear: function () {
      this.show();
      runtime.api.DOM.removeStyle(`${runtime.meta.name}-settings_init_col`);
    },
  },
  messageInput: {
    hidden: false,
    init: function () {
      runtime.api.DOM.addStyle(`${runtime.meta.name}-messageInput_init_col`, `
        .${modules.input?.buttons} > *:not(:last-child) {
          transition: width ${settings.transitionSpeed}ms !important;
          width: ${settings.messageInputButtonWidth}px !important;
          overflow: hidden !important;
        }
      `);
      if (settings.messageInputCollapse) this.hide();
    },
    hide: function () {
      runtime.api.DOM.addStyle(`${runtime.meta.name}-messageInput_hide_col`, `
        .${modules.input?.buttons} > *:not(:last-child) {
          width: 0px !important;
        }
      `);
      this.hidden = true;
    },
    show: function () {
      runtime.api.DOM.removeStyle(`${runtime.meta.name}-messageInput_hide_col`);
      this.hidden = false;
    },
    clear: function () {
      this.show();
      runtime.api.DOM.removeStyle(`${runtime.meta.name}-messageInput_init_col`);
    },
  },
  toolbar: {
    hidden: false,
    init: function () {
      runtime.api.DOM.addStyle(`${runtime.meta.name}-toolbar_init_col`, `
        .cui-toolbar > *:not(:last-child) {
          transition: width ${settings.transitionSpeed}ms !important;
          width: 24px !important;
          overflow: hidden !important;
        }
      `);
      if (settings.collapseToolbar) this.hide();
    },
    hide: function () {
      runtime.api.DOM.addStyle(`${runtime.meta.name}-toolbar_hide_col`, `
        .cui-toolbar > *:not(:last-child) {
          width: 0px !important;
          margin: 0px !important;
        }
      `);
      this.hidden = true;
    },
    show: function () {
      runtime.api.DOM.removeStyle(`${runtime.meta.name}-toolbar_hide_col`);
      this.hidden = false;
    },
    clear: function () {
      this.show();
      runtime.api.DOM.removeStyle(`${runtime.meta.name}-toolbar_init_col`);
    },
  },
  toolbarFull: {
    hidden: false,
    init: function () {
      runtime.api.DOM.addStyle(`${runtime.meta.name}-toolbarFull_init_col`, `
        .${modules.icons?.toolbar} > *:not(:last-child) {
          transition: max-width ${settings.transitionSpeed}ms !important;
          max-width: ${settings.toolbarElementMaxWidth}px !important;
          overflow: hidden !important;
        }
      `);
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
      `);
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
  init: function () {
    // Add root styles
    runtime.api.DOM.addStyle(`${runtime.meta.name}-root`, `
      .cui-toolbar {
        align-items: right;
        display: flex;
      }
      
      .${modules.icons?.selected}:not([id*="cui"]):has([d="M14.5 8a3 3 0 1 0-2.7-4.3c-.2.4.06.86.44 1.12a5 5 0 0 1 2.14 3.08c.01.06.06.1.12.1ZM18.44 17.27c.15.43.54.73 1 .73h1.06c.83 0 1.5-.67 1.5-1.5a7.5 7.5 0 0 0-6.5-7.43c-.55-.08-.99.38-1.1.92-.06.3-.15.6-.26.87-.23.58-.05 1.3.47 1.63a9.53 9.53 0 0 1 3.83 4.78ZM12.5 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2 20.5a7.5 7.5 0 0 1 15 0c0 .83-.67 1.5-1.5 1.5a.2.2 0 0 1-.2-.16c-.2-.96-.56-1.87-.88-2.54-.1-.23-.42-.15-.42.1v2.1a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2.1c0-.25-.31-.33-.42-.1-.32.67-.67 1.58-.88 2.54a.2.2 0 0 1-.2.16A1.5 1.5 0 0 1 2 20.5Z"]),
      .${modules.icons?.selected}:not([id*="cui"]):has([d="M23 12.38c-.02.38-.45.58-.78.4a6.97 6.97 0 0 0-6.27-.08.54.54 0 0 1-.44 0 8.97 8.97 0 0 0-11.16 3.55c-.1.15-.1.35 0 .5.37.58.8 1.13 1.28 1.61.24.24.64.15.8-.15.19-.38.39-.73.58-1.02.14-.21.43-.1.4.15l-.19 1.96c-.02.19.07.37.23.47A8.96 8.96 0 0 0 12 21a.4.4 0 0 1 .38.27c.1.33.25.65.4.95.18.34-.02.76-.4.77L12 23a11 11 0 1 1 11-10.62ZM15.5 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"]) {
        display: none;
      }

      .${modules.threads?.grid}>div:first-child,
      .${modules.threads?.list}>div:first-child,
      .${modules.threads?.headerRow} {
        min-width: 0px !important;
      }
    `);

    // Init styles for each button
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].init();
      if (!settings.buttonsActive[i]) this.buttons[i].toggle();
    }

    // Init resize styles
    this.resize.forEach((panel) => {
      panel.init();
      if (settings.floatingPanels) panel.float();
    });

    // Init collapse styles
    this.settings.init();
    this.messageInput.init();
    this.toolbar.init();
    this.toolbarFull.init();
  },
  reinit: function () {
    this.buttons.forEach((panel) => {
      if (panel._clear) {
        panel.clear();
        panel.init();
        if (!settings.buttonsActive[panel._index]) panel.toggle();
      }
    });
  },
  clear: function () {
    // Clear root styles
    runtime.api.DOM.removeStyle(`${runtime.meta.name}-root`);

    // Clear styles for each button
    this.buttons.forEach(panel => panel.clear());

    // Clear resize styles
    this.resize.forEach(panel => panel.clear());

    // Clear collapse styles
    this.settings.clear();
    this.messageInput.clear();
    this.toolbar.clear();
    this.toolbarFull.clear();
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
    modules.dispatcher.subscribe('CHANNEL_TOGGLE_MEMBERS_SECTION', this.reloadToolbar);
    modules.dispatcher.subscribe('PROFILE_PANEL_TOGGLE_SECTION', this.reloadToolbar);

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
    modules.dispatcher.unsubscribe('CHANNEL_TOGGLE_MEMBERS_SECTION', this.reloadToolbar);
    modules.dispatcher.unsubscribe('PROFILE_PANEL_TOGGLE_SECTION', this.reloadToolbar);

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
      if (i === settings.buttonIndexes[constants.I_SERVER_LIST])
        this.createToolbarButton(constants.I_SERVER_LIST, icons.serverList, locale.current.serverList);
      if (i === settings.buttonIndexes[constants.I_CHANNEL_LIST])
        this.createToolbarButton(constants.I_CHANNEL_LIST, icons.channelList, locale.current.channelList);
      if (i === settings.buttonIndexes[constants.I_MEMBERS_LIST] && elements.membersList)
        this.createToolbarButton(constants.I_MEMBERS_LIST, icons.membersList, locale.current.membersList);
      if (i === settings.buttonIndexes[constants.I_USER_PROFILE] && elements.userProfile)
        this.createToolbarButton(constants.I_USER_PROFILE, icons.userProfile, locale.current.userProfile);
      if (i === settings.buttonIndexes[constants.I_MESSAGE_INPUT] && elements.messageInput)
        this.createToolbarButton(constants.I_MESSAGE_INPUT, icons.messageInput, locale.current.messageInput);
      if (i === settings.buttonIndexes[constants.I_WINDOW_BAR] && elements.windowBar && !runtime.api.Plugins.isEnabled('OldTitleBar'))
        this.createToolbarButton(constants.I_WINDOW_BAR, icons.windowBar, locale.current.windowBar);
      if (i === settings.buttonIndexes[constants.I_CALL_WINDOW] && elements.callWindow)
        this.createToolbarButton(constants.I_CALL_WINDOW, icons.callWindow, locale.current.callWindow);
      if (i === settings.buttonIndexes[constants.I_USER_AREA])
        this.createToolbarButton(constants.I_USER_AREA, icons.userArea, locale.current.userArea);
    }
  };

  // Create a functional toolbar button
  createToolbarButton = (index, icon, label) => {
    // Create button and add it to the toolbar
    let button = BdApi.DOM.parseHTML(`
      <div id="cui-icon-${index}" class="${modules.icons?.iconWrapper} ${modules.icons?.clickable} ${settings.buttonsActive[index] ? modules.icons?.selected : ''}" role="button" aria-label="${label}" tabindex="0">
        <svg x="0" y="0" class="${modules.icons?.icon}" aria-hidden="false" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          ${icon}
        </svg>
      </div>
    `, true);
    runtime.toolbar.appendChild(button);

    button = document.querySelector(`#cui-icon-${index}`);

    // Add tooltip and click handler
    runtime.api.UI.createTooltip(button, label, { side: 'bottom' });
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
    styles.buttons[index].toggle();
    runtime.toolbar.querySelector(`#cui-icon-${index}`)?.classList.toggle(modules.icons?.selected);
    this.updateSettingsArray('buttonsActive', index, !settings.buttonsActive[index]);
  };

  // Add event listeners to handle resize/expand on hover
  addListeners = () => {
    document.body.addEventListener('mousedown', (e) => {
      // Handle left clicks
      if (e.button === 0) {
        // Dynamically handle resizing members list
        if (e.target.classList.contains(modules.members?.membersWrap)) {
          e.target.style.setProperty('width', `${settings.membersListWidth}px`, 'important');
          runtime.dragging = e.target;
        }

        // Dynamically handle resizing user profile
        if (e.target.classList.contains(modules.panel?.outer)) {
          e.target.style.setProperty('width', `${settings.userProfileWidth}px`, 'important');
          runtime.dragging = e.target;
        }

        // Dynamically handle resizing search panel
        if (e.target.classList.contains(modules.search?.searchResultsWrap)) {
          e.target.style.setProperty('width', `${settings.searchPanelWidth}px`, 'important');
          runtime.dragging = e.target;
        }

        // Dynamically handle resizing forum popout
        if (elements.popoutSpacer) {
          if (e.target.classList.contains(modules.popout?.chatLayerWrapper)) {
            e.target.style.setProperty('width', `${settings.forumPopoutWidth}px`, 'important');
            elements.popoutSpacer.style.setProperty('width', `${settings.forumPopoutWidth}px`, 'important');
            runtime.dragging = e.target;

            elements.popoutSpacer.style.setProperty('transition', 'none', 'important');
            elements.popoutSpacer.style.setProperty('max-width', '80vw', 'important');
          }
        }
        else {
          if (e.target.classList.contains(modules.popout?.floating) && !e.target.classList.contains(modules.popout?.chatTarget.split(' ')[0])) {
            e.target.style.setProperty('width', `${settings.forumPopoutWidth}px`, 'important');
            runtime.dragging = e.target;
          }
        }

        if (runtime.dragging) {
          runtime.dragging.style.setProperty('transition', 'none', 'important');
          runtime.dragging.style.setProperty('max-width', '80vw', 'important');
        }
      }
    }, { passive: true, signal: runtime.controller.signal });

    document.body.addEventListener('mouseup', (e) => {
      // Handle right clicks
      if (e.button === 2) {
        let target = null;

        // Reset members list width
        if (e.target.classList.contains(modules.members?.membersWrap)) {
          e.target.style.setProperty('transition', `max-width ${settings.transitionSpeed}ms, width ${settings.transitionSpeed}ms`, 'important');
          settings.membersListWidth = settings.defaultMembersListWidth;
          styles.buttons[constants.I_MEMBERS_LIST].init();
          target = e.target;
        }

        // Reset user profile width
        if (e.target.classList.contains(modules.panel?.outer)) {
          e.target.style.setProperty('transition', `max-width ${settings.transitionSpeed}ms, width ${settings.transitionSpeed}ms`, 'important');
          settings.userProfileWidth = settings.defaultUserProfileWidth;
          styles.buttons[constants.I_USER_PROFILE].init();
          target = e.target;
        }

        // Reset search panel width
        if (e.target.classList.contains(modules.search?.searchResultsWrap)) {
          e.target.style.setProperty('transition', `max-width ${settings.transitionSpeed}ms, width ${settings.transitionSpeed}ms`, 'important');
          settings.searchPanelWidth = settings.defaultSearchPanelWidth;
          styles.resize[constants.I_SEARCH_PANEL].init();
          target = e.target;
        }

        // Reset forum popout width
        if (elements.popoutSpacer) {
          if (e.target.classList.contains(modules.popout?.chatLayerWrapper)) {
            e.target.style.setProperty('transition', `max-width ${settings.transitionSpeed}ms, width ${settings.transitionSpeed}ms`, 'important');
            elements.popoutSpacer.style.setProperty('transition', `max-width ${settings.transitionSpeed}ms, width ${settings.transitionSpeed}ms`, 'important');
            settings.forumPopoutWidth = settings.defaultForumPopoutWidth;
            styles.resize[constants.I_FORUM_POPOUT].init();
            target = e.target;

            elements.popoutSpacer.style.removeProperty('width');
            // Timeout to provide smooth transition
            setTimeout(() => elements.popoutSpacer.style.removeProperty('transition'), settings.transitionSpeed);
          }
        }
        else {
          if (e.target.classList.contains(modules.popout?.floating) && !e.target.classList.contains(modules.popout?.chatTarget.split(' ')[0])) {
            e.target.style.setProperty('transition', `max-width ${settings.transitionSpeed}ms, width ${settings.transitionSpeed}ms`, 'important');
            settings.forumPopoutWidth = settings.defaultForumPopoutWidth;
            styles.resize[constants.I_FORUM_POPOUT].init();
            target = e.target;
          }
        }

        if (target) {
          target.style.removeProperty('width');
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

        // Clamp max width to 80vw
        let width = parseInt(dragging.style.width);
        if (width > window.innerWidth * 0.8)
          width = window.innerWidth * 0.8;

        // Finish resizing the members list
        if (dragging.classList.contains(modules.members?.membersWrap)) {
          settings.membersListWidth = width;
          styles.buttons[constants.I_MEMBERS_LIST].init();
          target = dragging;
        }

        // Finish resizing the user profile
        if (dragging.classList.contains(modules.panel?.outer)) {
          settings.userProfileWidth = width;
          styles.buttons[constants.I_USER_PROFILE].init();
          target = dragging;
        }

        // Finish resizing the search panel
        if (dragging.classList.contains(modules.search?.searchResultsWrap)) {
          settings.searchPanelWidth = width;
          styles.resize[constants.I_SEARCH_PANEL].init();
          target = dragging;
        }

        // Finish resizing the forum popout
        if (elements.popoutSpacer) {
          if (dragging.classList.contains(modules.popout?.chatLayerWrapper)) {
            settings.forumPopoutWidth = width;
            styles.resize[constants.I_FORUM_POPOUT].init();
            target = dragging;

            elements.popoutSpacer.style.removeProperty('width');
            elements.popoutSpacer.style.removeProperty('max-width');
            // Timeout to avoid transition flash
            setTimeout(() => elements.popoutSpacer.style.removeProperty('transition'), settings.transitionSpeed);
          }
        }
        else {
          if (dragging.classList.contains(modules.popout?.floating) && !dragging.classList.contains(modules.popout?.chatTarget.split(' ')[0])) {
            settings.forumPopoutWidth = width;
            styles.resize[constants.I_FORUM_POPOUT].init();
            target = dragging;
          }
        }

        if (target) {
          target.style.removeProperty('width');
          target.style.removeProperty('max-width');
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

      // Handle resizing members list/user profile/search panel/forum popout
      if (runtime.dragging.classList.contains(modules.members?.membersWrap)
        || runtime.dragging.classList.contains(modules.panel?.outer)
        || runtime.dragging.classList.contains(modules.search?.searchResultsWrap)
        || (runtime.dragging.classList.contains(modules.popout?.floating) && !runtime.dragging.classList.contains(modules.popout?.chatTarget.split(' ')[0])))
        runtime.dragging.style.setProperty('width', `${runtime.dragging.getBoundingClientRect().right - e.clientX}px`, 'important');

      if (runtime.dragging.classList.contains(modules.popout?.chatLayerWrapper)) {
        runtime.dragging.style.setProperty('width', `${runtime.dragging.getBoundingClientRect().right - e.clientX}px`, 'important');
        elements.popoutSpacer.style.setProperty('width', `${runtime.dragging.getBoundingClientRect().right - e.clientX}px`, 'important');
      }
    }, { passive: true, signal: runtime.controller.signal });

    document.body.addEventListener('mouseleave', (e) => {
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
    for (let i = 0; i < styles.buttons.length; i++) {
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
    for (let i = 0; i < styles.buttons.length; i++) {
      if (runtime.keys.symmetricDifference(settings.shortcutList[i]).size === 0)
        this.toggleButton(i);
    }
  };

  // Update dynamic collapsed state of elements
  tickExpandOnHover = (x, y) => {
    if (settings.expandOnHover) {
      for (let i = 0; i < styles.buttons.length; i++) {
        if (!settings.collapseDisabledButtons && settings.buttonIndexes[i] === 0)
          continue;

        if (settings.expandOnHoverEnabled[i] && (!settings.buttonsActive[i] || (settings.sizeCollapse && window.matchMedia(styles.buttons[i].query)).matches)) {
          if (this.isNear(elements.index[i], settings.expandOnHoverFudgeFactor, x, y)) {
            if (runtime.collapsed[i]) {
              if (settings.floatingPanels) styles.buttons[i].float();
              this.collapseElementDynamic(i, false);
            }
          }
          else {
            if (!runtime.collapsed[i]) {
              if (elements.biteSizePanel
                || elements.rightClickMenu) {
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
        if (styles.settings.hidden) styles.settings.show();
      }
      else {
        if (!styles.settings.hidden) styles.settings.hide();
      }
    }
  };

  // Update dynamic collapsed state of message input buttons
  tickMessageInputCollapse = (x, y) => {
    if (settings.messageInputCollapse) {
      if (this.isNear(elements.messageInputContainer, settings.buttonCollapseFudgeFactor, x, y)) {
        if (styles.messageInput.hidden) styles.messageInput.show();
      }
      else {
        if (!styles.messageInput.hidden) styles.messageInput.hide();
      }
    }
  };

  // Update dynamic collapsed state of toolbar buttons
  tickCollapseToolbar = (x, y, full) => {
    if (settings.collapseToolbar) {
      if (this.isNear(runtime.toolbar, settings.buttonCollapseFudgeFactor, x, y)
        && !this.isNear(elements.forumPopout, 0, x, y)) {
        if (styles.toolbar.hidden) styles.toolbar.show();
      }
      else {
        if (!styles.toolbar.hidden) styles.toolbar.hide();
      }
      if (full) {
        if (this.isNear(elements.toolbar, settings.buttonCollapseFudgeFactor, x, y)
          && !this.isNear(elements.forumPopout, 0, x, y)) {
          if (styles.toolbarFull.hidden) styles.toolbarFull.show();
        }
        else {
          if (!styles.toolbarFull.hidden) styles.toolbarFull.hide();
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
    let right = left + box.width + (2 * distance);
    let bottom = top + box.height + (2 * distance);

    return (x > left && x < right && y > top && y < bottom);
  };

  // Update the dynamic collapsed state of an element
  collapseElementDynamic(index, collapsed) {
    if (collapsed) {
      if (settings.sizeCollapse && window.matchMedia(styles.buttons[index].query).matches)
        runtime.api.DOM.removeStyle(styles.buttons[index]._queryToggle[0]);
      else
        runtime.api.DOM.addStyle(
          `${styles.buttons[index]._toggle[0]}_dynamic`,
          styles.buttons[index]._toggle[1],
        );
    }
    else {
      if (settings.sizeCollapse && window.matchMedia(styles.buttons[index].query).matches)
        runtime.api.DOM.addStyle(...styles.buttons[index]._queryToggle);
      else
        runtime.api.DOM.removeStyle(
          `${styles.buttons[index]._toggle[0]}_dynamic`,
        );
    }
    runtime.collapsed[index] = collapsed;
  }
};
