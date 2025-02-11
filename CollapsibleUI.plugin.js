/**
 * @name CollapsibleUI
 * @author programmer2514
 * @authorId 563652755814875146
 * @description A feature-rich BetterDiscord plugin that reworks the Discord UI to be significantly more modular
 * @version 10.0.1
 * @donate https://ko-fi.com/benjaminpryor
 * @patreon https://www.patreon.com/BenjaminPryor
 * @website https://github.com/programmer2514/BetterDiscord-CollapsibleUI
 * @source https://github.com/programmer2514/BetterDiscord-CollapsibleUI/raw/refs/heads/main/CollapsibleUI.plugin.js
 */

const config = {
  changelog: [
    {
      title: '10.0.1',
      type: 'added',
      items: [
        'Fixed settings failing to apply immediately when set',
      ],
    },
    {
      title: '1.0.0 - 10.0.0',
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
          id: 'transition-speed',
          name: 'UI Transition Speed (ms)',
          note: 'Sets the speed of UI animations. Set to 0 to disable transitions',
          value: 250,
        },
        {
          type: 'dropdown',
          id: 'collapse-toolbar',
          name: 'Collapse Toolbar Buttons',
          note: 'Automatically collapse the top-right toolbar buttons',
          value: 'cui',
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
          id: 'collapse-settings',
          name: 'Collapse Settings',
          note: 'Automatically collapse the bottom-left settings buttons',
          value: true,
        },
        {
          type: 'switch',
          id: 'message-input-collapse',
          name: 'Collapse Message Input Buttons',
          note: 'Automatically collapse the GIF/sticker/emoji/gift buttons',
          value: true,
        },
        {
          type: 'switch',
          id: 'resizable-channel-list',
          name: 'Resizable Channel List',
          note: 'Resize the channel list by clicking-and-dragging the bottom-right corner. Right-click to reset width',
          value: true,
        },
        {
          type: 'switch',
          id: 'resizable-members-list',
          name: 'Resizable Members List',
          note: 'Resize the members list by clicking-and-dragging the bottom-left corner. Right-click to reset width',
          value: true,
        },
        {
          type: 'switch',
          id: 'resizable-user-profile',
          name: 'Resizable User Profile',
          note: 'Resize the user profile in DMs by clicking-and-dragging the bottom-left corner. Right-click to reset width',
          value: true,
        },
        {
          type: 'switch',
          id: 'resizable-search-panel',
          name: 'Resizable Search Panel',
          note: 'Resize the message search panel by clicking-and-dragging the bottom-left corner. Right-click to reset width',
          value: true,
        },
        {
          type: 'switch',
          id: 'resizable-forum-popout',
          name: 'Resizable Forum Popout',
          note: 'Resize the thread popup in forum channels by clicking-and-dragging the bottom-left corner. Right-click to reset width',
          value: true,
        },
        {
          type: 'switch',
          id: 'unread-dms-badge',
          name: 'Persistent Unread DMs Badge',
          note: 'Always display the total number of unread DMs in the top left. Useful if server/channel list is collapsed',
          value: false,
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
          id: 'keyboard-shortcuts',
          name: 'Keyboard Shortcuts',
          note: 'Collapse UI panels using keyboard shortcuts',
          value: true,
        },
        {
          type: 'keybind',
          id: 'server-list-shortcut',
          name: 'Toggle Server List',
          note: 'Must be modifiers + one letter. For instance, Ctrl+Alt+Shift+P will work, but Alt+M+B will not',
          value: ['Alt', 's'],
        },
        {
          type: 'keybind',
          id: 'channel-list-shortcut',
          name: 'Toggle Channel List',
          note: 'Must be modifiers + one letter. For instance, Ctrl+Alt+Shift+P will work, but Alt+M+B will not',
          value: ['Alt', 'c'],
        },
        {
          type: 'keybind',
          id: 'members-list-shortcut',
          name: 'Toggle Members List',
          note: 'Must be modifiers + one letter. For instance, Ctrl+Alt+Shift+P will work, but Alt+M+B will not',
          value: ['Alt', 'm'],
        },
        {
          type: 'keybind',
          id: 'user-profile-shortcut',
          name: 'Toggle User Profile',
          note: 'Must be modifiers + one letter. For instance, Ctrl+Alt+Shift+P will work, but Alt+M+B will not',
          value: ['Alt', 'p'],
        },
        {
          type: 'keybind',
          id: 'message-input-shortcut',
          name: 'Toggle Message Input',
          note: 'Must be modifiers + one letter. For instance, Ctrl+Alt+Shift+P will work, but Alt+M+B will not',
          value: ['Alt', 'i'],
        },
        {
          type: 'keybind',
          id: 'window-bar-shortcut',
          name: 'Toggle Window Bar',
          note: 'Must be modifiers + one letter. For instance, Ctrl+Alt+Shift+P will work, but Alt+M+B will not',
          value: ['Alt', 'w'],
        },
        {
          type: 'keybind',
          id: 'call-window-shortcut',
          name: 'Toggle Call Window',
          note: 'Must be modifiers + one letter. For instance, Ctrl+Alt+Shift+P will work, but Alt+M+B will not',
          value: ['Alt', 'v'],
        },
        {
          type: 'keybind',
          id: 'user-area-shortcut',
          name: 'Toggle User Area',
          note: 'Must be modifiers + one letter. For instance, Ctrl+Alt+Shift+P will work, but Alt+M+B will not',
          value: ['Alt', 'u'],
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
          id: 'collapse-disabled-buttons',
          name: 'Disabled Buttons Stay Collapsed?',
          note: 'Panels with disabled toggle buttons will remain collapsed',
          value: false,
        },
        {
          type: 'slider',
          id: 'server-list-button-index',
          name: 'Server List Button',
          note: 'Sets the order of the Server List toolbar button. Set to 0 to disable',
          value: 1,
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
          value: 2,
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
          value: 4,
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
          value: 5,
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
          value: 3,
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
          value: 0,
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
          value: 6,
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
          value: 0,
          min: 0,
          max: 8,
          step: 1,
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
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
          id: 'expand-on-hover',
          name: 'Expand on Hover',
          note: 'Expands collapsed UI panels when the mouse is near them. Must be enabled for conditional/size collapse to work',
          value: true,
        },
        {
          type: 'switch',
          id: 'floating-panels',
          name: 'Floating Panels',
          note: 'Expanded UI panels will float over other panels, instead of moving them out of the way',
          value: true,
        },
        {
          type: 'switch',
          id: 'server-list-expand-on-hover',
          name: 'Server List',
          note: 'Server List expands on hover',
          value: true,
        },
        {
          type: 'switch',
          id: 'channel-list-expand-on-hover',
          name: 'Channel List',
          note: 'Channel List expands on hover',
          value: true,
        },
        {
          type: 'switch',
          id: 'members-list-expand-on-hover',
          name: 'Members List',
          note: 'Members List expands on hover',
          value: true,
        },
        {
          type: 'switch',
          id: 'user-profile-expand-on-hover',
          name: 'User Profile',
          note: 'User Profile expands on hover',
          value: true,
        },
        {
          type: 'switch',
          id: 'message-input-expand-on-hover',
          name: 'Message Input',
          note: 'Message Input expands on hover',
          value: true,
        },
        {
          type: 'switch',
          id: 'window-bar-expand-on-hover',
          name: 'Window Bar',
          note: 'Window Bar expands on hover',
          value: true,
        },
        {
          type: 'switch',
          id: 'call-window-expand-on-hover',
          name: 'Call Window',
          note: 'Call Window expands on hover',
          value: true,
        },
        {
          type: 'switch',
          id: 'user-area-expand-on-hover',
          name: 'User Area',
          note: 'User Area expands on hover',
          value: true,
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
          id: 'size-collapse',
          name: 'Size Collapse',
          note: 'Auto-collapse UI panels based on window size. Expand on Hover must be enabled',
          value: false,
        },
        {
          type: 'number',
          id: 'server-list-threshold',
          name: 'Server List - Width Threshold (px)',
          note: 'Window width at which the Server List will collapse. Specifies height if Horizontal Server List is enabled',
          value: 500,
        },
        {
          type: 'number',
          id: 'channel-list-threshold',
          name: 'Channel List - Width Threshold (px)',
          note: 'Window width at which the Channel List will collapse',
          value: 600,
        },
        {
          type: 'number',
          id: 'members-list-threshold',
          name: 'Members List - Width Threshold (px)',
          note: 'Window width at which the Members List will collapse',
          value: 950,
        },
        {
          type: 'number',
          id: 'user-profile-threshold',
          name: 'User Profile - Width Threshold (px)',
          note: 'Window width at which the User Profile will collapse',
          value: 1000,
        },
        {
          type: 'number',
          id: 'message-input-threshold',
          name: 'Message Input - Height Threshold (px)',
          note: 'Window height at which the Message Input will collapse',
          value: 400,
        },
        {
          type: 'number',
          id: 'window-bar-threshold',
          name: 'Window Bar - Height Threshold (px)',
          note: 'Window height at which the Window Bar will collapse',
          value: 200,
        },
        {
          type: 'number',
          id: 'call-window-threshold',
          name: 'Call Window - Height Threshold (px)',
          note: 'Window height at which the Call Window will collapse',
          value: 550,
        },
        {
          type: 'number',
          id: 'user-area-threshold',
          name: 'User Area - Height Threshold (px)',
          note: 'Window height at which the User Area will collapse',
          value: 400,
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
          id: 'conditional-collapse',
          name: 'Conditional Collapse',
          note: 'Auto-collapse UI panels based on custom conditional expression. Overrides size collapse',
          value: false,
        },
        {
          type: 'text',
          id: 'server-list-conditional',
          name: 'Server List - Collapse Expression (JS)',
          note: 'The Server List will collapse when this expression is true, and expand when it is false',
          value: '',
        },
        {
          type: 'text',
          id: 'channel-list-conditional',
          name: 'Channel List - Collapse Expression (JS)',
          note: 'The Channel List will collapse when this expression is true, and expand when it is false',
          value: '',
        },
        {
          type: 'text',
          id: 'members-list-conditional',
          name: 'Members List - Collapse Expression (JS)',
          note: 'The Members List will collapse when this expression is true, and expand when it is false',
          value: '',
        },
        {
          type: 'text',
          id: 'user-profile-conditional',
          name: 'User Profile - Collapse Expression (JS)',
          note: 'The User Profile will collapse when this expression is true, and expand when it is false',
          value: '',
        },
        {
          type: 'text',
          id: 'message-input-conditional',
          name: 'Message Input - Collapse Expression (JS)',
          note: 'The Message Input will collapse when this expression is true, and expand when it is false',
          value: '',
        },
        {
          type: 'text',
          id: 'window-bar-conditional',
          name: 'Window Bar - Collapse Expression (JS)',
          note: 'The Window Bar will collapse when this expression is true, and expand when it is false',
          value: '',
        },
        {
          type: 'text',
          id: 'call-window-conditional',
          name: 'Call Window - Collapse Expression (JS)',
          note: 'The Call Window will collapse when this expression is true, and expand when it is false',
          value: '',
        },
        {
          type: 'text',
          id: 'user-area-conditional',
          name: 'User Area - Collapse Expression (JS)',
          note: 'The User Area will collapse when this expression is true, and expand when it is false',
          value: '',
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
          id: 'collapse-size',
          name: 'Collapsed Panel Size (px)',
          note: 'The size of UI panels when collapsed',
          value: 0,
        },
        {
          type: 'number',
          id: 'button-collapse-fudge-factor',
          name: 'Button Groups - Collapse Fudge Factor (px)',
          note: 'The distance the mouse must be from a set of buttons before they collapse',
          value: 10,
        },
        {
          type: 'number',
          id: 'expand-on-hover-delay',
          name: 'Expand on Hover - Delay (ms)',
          note: 'The amount of time required to hover near a collapsed panel before it expands',
          value: 15,
        },
        {
          type: 'number',
          id: 'expand-on-hover-opening-fudge-factor',
          name: 'Expand on Hover - Expand Fudge Factor (px)',
          note: 'The distance the mouse must be from a UI panel before it expands',
          value: 30,
        },
        {
          type: 'number',
          id: 'expand-on-hover-closing-fudge-factor',
          name: 'Expand on Hover - Collapse Fudge Factor (px)',
          note: 'The distance the mouse must be from a UI panel before it collapses',
          value: 30,
        },
        {
          type: 'number',
          id: 'settings-buttons-max-width',
          name: 'Settings Buttons - Max Width (px)',
          note: 'The maximum width of the user area settings buttons when expanded',
          value: 100,
        },
        {
          type: 'number',
          id: 'message-input-buttons-max-width',
          name: 'Message Input Buttons - Max Width (px)',
          note: 'The maximum width of the message input buttons when expanded',
          value: 300,
        },
        {
          type: 'number',
          id: 'message-input-buttons-collapsed-width',
          name: 'Message Input Buttons - Collapsed Width (px)',
          note: 'The width of the message input buttons when collapsed',
          value: 40,
        },
        {
          type: 'number',
          id: 'toolbar-buttons-max-width',
          name: 'Toolbar Buttons - Max Width (px)',
          note: 'The maximum width of the toolbar buttons when expanded',
          value: 300,
        },
        {
          type: 'number',
          id: 'toolbar-max-width',
          name: 'Toolbar - Max Width (px)',
          note: 'The maximum width of the toolbar when expanded',
          value: 800,
        },
        {
          type: 'number',
          id: 'user-area-max-height',
          name: 'User Area - Max Height (px)',
          note: 'The maximum height of the User Area when expanded',
          value: 300,
        },
        {
          type: 'number',
          id: 'message-input-max-height',
          name: 'Message Input - Max Height (px)',
          note: 'The maximum height of the Message Input when expanded',
          value: 400,
        },
        {
          type: 'number',
          id: 'window-bar-height',
          name: 'Window Bar - Height (px)',
          note: 'The height of the Window Bar when expanded',
          value: 18,
        },
      ],
    },
  ],
};

const constants = {
  MAX_ITER_MUTATIONS: 35,
  TOOLTIP_OFFSET_PX: 8,
  I_SERVER_LIST: 0,
  I_CHANNEL_LIST: 1,
  I_MEMBERS_LIST: 2,
  I_USER_PROFILE: 3,
  I_MESSAGE_INPUT: 4,
  I_WINDOW_BAR: 5,
  I_CALL_WINDOW: 6,
  I_USER_AREA: 7,
};

const settings = {
  transitionSpeed: 250,
  collapseToolbar: 'cui',
  collapseSettings: true,
  messageInputCollapse: true,
  resizableChannelList: true,
  resizableMembersList: true,
  resizableUserProfile: true,
  resizableSearchPanel: true,
  resizableForumPopout: true,
  unreadDMsBadge: false,
  keyboardShortcuts: true,
  shortcutList: [
    ['Alt', 's'],
    ['Alt', 'c'],
    ['Alt', 'm'],
    ['Alt', 'p'],
    ['Alt', 'i'],
    ['Alt', 'w'],
    ['Alt', 'v'],
    ['Alt', 'u'],
  ],
  collapseDisabledButtons: false,
  buttonIndexes: [1, 2, 4, 5, 3, 0, 6, 0],
  expandOnHover: true,
  floatingPanels: true,
  expandOnHoverEnabled: [true, true, true, true, true, true, true, true],
  sizeCollapse: false,
  sizeCollapseThreshold: [500, 600, 950, 1000, 400, 200, 550, 400],
  conditionalCollapse: false,
  collapseConditionals: ['', '', '', '', '', '', '', ''],
  collapseSize: 0,
  buttonCollapseFudgeFactor: 10,
  expandOnHoverDelay: 15,
  expandOnHoverOpeningFudgeFactor: 30,
  expandOnHoverClosingFudgeFactor: 30,
  settingsButtonsMaxWidth: 100,
  messageInputButtonsMaxWidth: 300,
  messageInputButtonsCollapsedWidth: 40,
  toolbarButtonsMaxWidth: 300,
  toolbarMaxWidth: 800,
  userAreaMaxHeight: 300,
  messageInputMaxHeight: 400,
  windowBarHeight: 18,
  channelListWidth: 0,
  membersListWidth: 0,
  profilePanelWidth: 0,
  searchPanelWidth: 0,
  forumPopoutWidth: 0,
};

const modules = {
  icons: null,
  callContainer: null,
  callMembers: null,
  dms: null,
  app: null,
  sidebar: null,
  servers: null,
  members: null,
  member: null,
  panel: null,
  banner: null,
  guilds: null,
  buttons: null,
  ephemeral: null,
  badge: null,
  threads: null,
  layers: null,
  toolbar: null,
  social: null,
  frame: null,
  profile: null,
  user: null,
  layout: null,
  window: null,
  input: null,
  controls: null,
  attachments: null,
  floating: null,
  emptyState: null,
  effects: null,
  search: null,
  searchHeader: null,
};

const elements = {
  appBase: null,
  baseLayer: null,
  toolbar: null,
  searchBar: null,
  inviteToolbar: null,
  windowBar: null,
  wordMark: null,
  messageInput: null,
  userArea: null,
  userProfile: null,
  innerUserProfile: null,
  userProfileFooter: null,
  userProfileWrapper: null,
  userProfileSVGWrapper: null,
  membersList: null,
  serverList: null,
  channelList: null,
  settingsContainerBase: null,
  settingsContainer: null,
  spotifyContainer: null,
  outerAppWrapper: null,
  avatarWrapper: null,
  searchPanel: null,
  forumPopout: null,
  forumPopoutTarget: null,
  moreButton: null,
  membersListButton: null,
  userProfileButton: null,
  fullscreenButton: null,
  messageInputButtonContainer: null,
  innerMembersList: null,
  membersListWrapper: null,
  contentWindow: null,
  callContainer: null,
};

const runtime = {
  meta: null,
  api: null,
  localeLabels: null,
  mouse: {
    x: 0,
    y: 0,
  },
  collapsed: [true, true, true, true, true, true, true, true],
  delays: [false, false, false, false, false, false, false, false],
  events: {
    controller: null,
    signal: null,
  },
  observers: {
    app: null,
    settings: null,
    resize: {
      channelList: null,
      membersList: null,
      userProfile: null,
      searchPanel: null,
      forumPopout: null,
    },
  },
  buttons: [null, null, null, null, null, null, null, null],
  themes: {
    darkMatter: false,
    horizontalServerList: false,
  },
  moduleLoader: null,
};

// Export plugin class
module.exports = class CollapsibleUI {
  // Get api and metadata
  constructor(meta) {
    runtime.meta = meta;
    runtime.api = new BdApi(runtime.meta.name);
  }

  // Initialize the plugin when it is enabled
  start = async () => {
    this.getJSON('https://api.github.com/repos/programmer2514/BetterDiscord-CollapsibleUI/releases')
      .then((data) => {
        if (data[0].tag_name.substring(1) !== runtime.meta.version)
          runtime.api.UI.showNotice(`Your version (v${runtime.meta.version}) \
            of CollapsibleUI is outdated and may be missing features! You can \
            either wait for v${data[0].tag_name.substring(1)} to be approved, \
            or download it manually.`, { timeout: '0' });
      });

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

    const UserStore = runtime.api.Webpack.getByKeys('getCurrentUser', 'getUser');
    const Dispatcher = runtime.api.Webpack.getByKeys('dispatch', 'isDispatching');

    if (UserStore.getCurrentUser()) {
      console.log('%c[CollapsibleUI] ' + '%cAttempting pre-load...',
        'color: #3a71c1; font-weight: 700;', '');
      this.initialize();
    }

    Dispatcher.subscribe('POST_CONNECTION_OPEN', this.initialize);

    console.log('%c[CollapsibleUI] ' + `%c(v${runtime.meta.version}) ` + '%chas started.',
      'color: #3a71c1; font-weight: 700;', 'color: #666; font-weight: 600;', '');
  };

  // Restore the default UI when the plugin is disabled
  stop = async () => {
    this.terminate();
    console.log('%c[CollapsibleUI] ' + `%c(v${runtime.meta.version}) ` + '%chas stopped.',
      'color: #3a71c1; font-weight: 700;', 'color: #666; font-weight: 600;', '');
  };

  // Re-initialize the plugin on switch
  onSwitch = async () => {
    this.initialize();
  };

  // Add settings panel
  getSettingsPanel = () => {
    return runtime.api.UI.buildSettingsPanel(
      {
        settings: config.settings,
        onChange: (_, id, value) => runtime.api.Data.save(id, value),
      },
    );
  };

  // Main plugin code
  initialize = async () => {
    try {
      this.locateModules();
      this.locateElements();
      this.getLabels();

      this.terminate(); // Clean up UI

      // Display reloading message (dev only)
      // console.log('%c[CollapsibleUI] ' + '%cReloading...', 'color: #3a71c1; font-weight: 700;', '');

      // Event listener handler
      runtime.events.controller = new AbortController();
      runtime.events.signal = runtime.events.controller.signal;

      this.initSettings();
      this.initThemeIntegration();
      this.initObservers();

      // Hide default Members List/Profile Panel buttons
      if (elements.membersListButton && elements.membersList)
        elements.membersListButton.style.setProperty('display', 'none', 'important');
      if (elements.userProfileButton && elements.userProfile)
        elements.userProfileButton.style.setProperty('display', 'none', 'important');

      var buttonsActive = this.initToolbar();

      if (settings.expandOnHover) {
        // Collapse vanilla toolbar
        if (settings.collapseToolbar === 'all') {
          var singleButtonWidth = runtime.buttons[constants.I_SERVER_LIST].getBoundingClientRect().width
            + parseInt(window.getComputedStyle(runtime.buttons[constants.I_SERVER_LIST]).marginRight) + 'px';
          elements.toolbar.style.setProperty('max-width', singleButtonWidth, 'important');
        }

        // Collapse toolbar buttons
        if (settings.collapseToolbar)
          this.collapseToolbarIcons(buttonsActive);

        // Fix settings button alignment
        if (elements.settingsContainerBase)
          elements.settingsContainerBase.style.setProperty('justify-content', 'space-between', 'important');

        // Collapse settings buttons
        if (settings.collapseSettings) {
          // Define settings buttons array
          var settingsButtons = elements.settingsContainer.children;

          // Collapse settings buttons
          for (var i = 0; i < (settingsButtons.length - 1); i++) {
            settingsButtons[i].style.setProperty('max-width', '0px', 'important');
            settingsButtons[i].style.transition = 'max-width ' + settings.transitionSpeed + 'ms';
            settingsButtons[i].style.setProperty('overflow', 'hidden', 'important');
          }
        }

        // Collapse message bar buttons
        if ((settings.messageInputCollapse) && elements.messageInputButtonContainer) {
          elements.messageInputButtonContainer.style.maxWidth =
            settings.messageInputButtonsCollapsedWidth + 'px';
          elements.messageInputButtonContainer.style.transition = 'max-width ' + settings.transitionSpeed + 'ms';
        }
      }

      this.initUI();
      this.addMiscEventListeners(buttonsActive, settingsButtons, singleButtonWidth);
      this.addButtonClickHandlers();
    }
    catch (e) {
      console.warn('%c[CollapsibleUI] ' + '%cCould not initialize toolbar! (see below)  ',
        'color: #3a71c1; font-weight: 700;', '');
      console.warn(e);
    }
  };

  // Terminate the plugin and undo its effects
  terminate = async () => {
    try {
      // Remove CollapsibleUI icons
      document.querySelectorAll('.collapsible-ui-element')
        .forEach(e => e.remove());

      document.querySelectorAll('.' + modules.member?.member)
        .forEach(e => e.style.removeProperty('max-width'));

      // Re-enable the original Members List icon
      try {
        elements.searchBar.previousElementSibling.style.removeProperty('display');
      }
      catch {}

      // Expand any collapsed elements & remove transitions
      if (elements.channelList) {
        elements.channelList.style.removeProperty('width');
        elements.channelList.style.removeProperty('transition');
        elements.channelList.style.removeProperty('resize');
        elements.channelList.style.removeProperty('max-width');
        elements.channelList.style.removeProperty('display');
        elements.channelList.style.removeProperty('overflow');
        elements.channelList.style.removeProperty('position');
        elements.channelList.style.removeProperty('z-index');
        elements.channelList.style.removeProperty('max-height');
        elements.channelList.style.removeProperty('height');
      }
      if (elements.serverList) {
        elements.serverList.style.removeProperty('width');
        elements.serverList.style.removeProperty('transition');
        elements.serverList.style.removeProperty('display');
        elements.serverList.style.removeProperty('position');
        elements.serverList.style.removeProperty('z-index');
        elements.serverList.style.removeProperty('max-height');
        elements.serverList.style.removeProperty('overflow-y');
      }
      if (elements.windowBar) {
        elements.windowBar.style.removeProperty('height');
        elements.windowBar.style.removeProperty('opacity');
        elements.windowBar.style.removeProperty('padding');
        elements.windowBar.style.removeProperty('margin');
        elements.windowBar.style.removeProperty('overflow');
        elements.windowBar.style.removeProperty('transition');
        elements.windowBar.style.removeProperty('display');
      }
      if (elements.membersList) {
        elements.channelList.style.removeProperty('width');
        elements.channelList.style.removeProperty('resize');
        elements.membersList.style.removeProperty('max-width');
        elements.membersList.style.removeProperty('min-width');
        elements.membersList.style.removeProperty('overflow');
        elements.membersList.style.removeProperty('transition');
        elements.membersList.style.removeProperty('display');
        elements.membersList.style.removeProperty('transform');
        elements.membersList.style.removeProperty('flex-basis');
        elements.membersList.style.removeProperty('position');
        elements.membersList.style.removeProperty('z-index');
        elements.membersList.style.removeProperty('max-height');
        elements.membersList.style.removeProperty('height');
        elements.membersList.style.removeProperty('right');
      }
      if (elements.innerMembersList) {
        elements.innerMembersList.style.removeProperty('max-width');
        elements.innerMembersList.style.removeProperty('min-width');
        elements.innerMembersList.style.removeProperty('transform');
      }
      if (elements.contentWindow) {
        elements.contentWindow.style.removeProperty('transition');
        elements.contentWindow.style.removeProperty('max-width');
      }
      if (elements.userProfile) {
        elements.userProfile.style.removeProperty('max-width');
        elements.userProfile.style.removeProperty('min-width');
        elements.userProfile.style.removeProperty('width');
        elements.userProfile.style.removeProperty('overflow');
        elements.userProfile.style.removeProperty('resize');
        elements.userProfile.style.removeProperty('transition');
        elements.userProfile.style.removeProperty('transform');
        elements.userProfile.style.removeProperty('display');
        elements.userProfile.style.removeProperty('position');
        elements.userProfile.style.removeProperty('z-index');
        elements.userProfile.style.removeProperty('max-height');
        elements.userProfile.style.removeProperty('height');
        elements.userProfile.style.removeProperty('right');
      }
      if (elements.userProfileWrapper) {
        elements.userProfileWrapper.style.removeProperty('width');
      }
      if (elements.innerUserProfile) {
        elements.innerUserProfile.style.removeProperty('max-width');
        elements.innerUserProfile.style.removeProperty('width');
        elements.innerUserProfile.style.removeProperty('transform');
      }
      if (elements.userProfileSVGWrapper) {
        elements.userProfileSVGWrapper.style.removeProperty('max-height');
        elements.userProfileSVGWrapper.style.removeProperty('min-width');
        elements.userProfileSVGWrapper.querySelector('mask rect').setAttribute('width', '100%');
        elements.userProfileSVGWrapper.setAttribute('viewBox', '0 0 340 120');
      }
      if (elements.messageInput) {
        elements.messageInput.style.removeProperty('max-height');
        elements.messageInput.style.removeProperty('overflow');
        elements.messageInput.style.removeProperty('transition');
        elements.messageInput.style.removeProperty('display');
      }
      if (elements.settingsContainer) {
        for (var i = 0; i < (elements.settingsContainer.children.length - 1); i++) {
          elements.settingsContainer.children[i].style.removeProperty('max-width');
          elements.settingsContainer.children[i].style.removeProperty('transition');
          elements.settingsContainer.children[i].style.removeProperty('overflow');
          elements.settingsContainer.children[i].style.removeProperty('display');
        }
        elements.settingsContainer.style.removeProperty('display');
      }
      if (elements.messageInputButtonContainer) {
        elements.messageInputButtonContainer.style.removeProperty('transition');
        elements.messageInputButtonContainer.style.removeProperty('max-width');
      }
      if (elements.spotifyContainer) {
        elements.spotifyContainer.style.removeProperty('display');
      }
      if (elements.userArea) {
        elements.userArea.style.removeProperty('max-height');
        elements.userArea.style.removeProperty('transition');
        elements.userArea.style.removeProperty('display');
        elements.userArea.style.removeProperty('overflow');
      }
      if (elements.callContainer()) {
        elements.callContainer().style.setProperty('max-height',
          (window.outerHeight - 222) + 'px', 'important');
        elements.callContainer().style.removeProperty('transition');
        elements.callContainer().style.removeProperty('display');
        if (document.querySelector('.' + modules.callMembers?.voiceCallWrapper))
          document.querySelector('.' + modules.callMembers?.voiceCallWrapper).style
            .removeProperty('display');
      }
      if (elements.appBase) {
        elements.appBase.style.removeProperty('top');
        elements.appBase.style.removeProperty('min-width');
        elements.appBase.style.removeProperty('transition');
      }
      if (elements.toolbar) {
        elements.toolbar.style.removeProperty('max-width');
        elements.toolbar.style.removeProperty('transition');
      }

      if (elements.settingsContainerBase) {
        elements.settingsContainerBase.style.removeProperty('left');
        elements.settingsContainerBase.style.removeProperty('width');
        elements.settingsContainerBase.style.removeProperty('transition');
      }
      if (elements.avatarWrapper) {
        elements.avatarWrapper.style.removeProperty('min-width');
      }

      if (elements.wordMark) {
        elements.wordMark.style.removeProperty('display');
        elements.wordMark.style.removeProperty('margin-left');
      }

      // Delete plugin stylesheets
      runtime.api.DOM.removeStyle('cui-root');
      runtime.api.DOM.removeStyle('cui-members');

      // Abort listeners & observers
      runtime.events.controller?.abort();
      runtime.observers.settings?.disconnect();
      runtime.observers.app?.disconnect();
      runtime.observers.resize.channelList?.disconnect();
      runtime.observers.resize.membersList?.disconnect();
      runtime.observers.resize.userProfile?.disconnect();
    }
    catch (e) {
      console.warn('%c[CollapsibleUI] ' + '%cCould not successfully terminate plugin! (see below) ',
        'color: #3a71c1; font-weight: 700;', '');
      console.warn(e);
    }
  };

  // Locates needed webpack modules
  locateModules = (listening = false) => {
    if (!listening) {
      modules.icons = runtime.api.Webpack.getByKeys('selected', 'iconWrapper', 'clickable', 'icon');
      modules.callContainer = runtime.api.Webpack.getByKeys('wrapper', 'fullScreen', 'callContainer');
      modules.callMembers = runtime.api.Webpack.getByKeys('voiceCallWrapper', 'videoGrid', 'hiddenParticipants');
      modules.dms = runtime.api.Webpack.getByKeys('channel', 'linkButton', 'dm');
      modules.app = runtime.api.Webpack.getByKeys('app', 'layers');
      modules.sidebar = runtime.api.Webpack.getByKeys('sidebar', 'activityPanel', 'sidebarListRounded');
      modules.servers = runtime.api.Webpack.getByKeys('wrapper', 'unreadMentionsIndicatorTop', 'discoveryIcon');
      modules.members = runtime.api.Webpack.getByKeys('membersWrap', 'hiddenMembers', 'roleIcon');
      modules.member = runtime.api.Webpack.getByKeys('member', 'ownerIcon', 'activityText', 'clanTag');
      modules.panel = runtime.api.Webpack.getByKeys('biteSize', 'fullSize', 'panel', 'outer', 'inner', 'overlay');
      modules.banner = runtime.api.Webpack.getByKeys('banner', 'gifTag', 'mask');
      modules.guilds = runtime.api.Webpack.getByKeys('chatContent', 'noChat', 'parentChannelName', 'linkedLobby');
      modules.buttons = runtime.api.Webpack.getByKeys('button', 'selected', 'separator', 'disabled');
      modules.ephemeral = runtime.api.Webpack.getByKeys('thin', 'customTheme', 'fade', 'scrolling');
      modules.badge = runtime.api.Webpack.getByKeys('baseShapeRound', 'numberBadge', 'premiumBadge');
      modules.layers = runtime.api.Webpack.getByKeys('layers', 'animating', 'bg', 'baseLayer');
      modules.toolbar = runtime.api.Webpack.getByKeys('updateIconForeground', 'search', 'forumOrHome');
      modules.social = runtime.api.Webpack.getByKeys('inviteToolbar', 'peopleColumn', 'addFriend');
      modules.frame = runtime.api.Webpack.getByKeys('typeMacOS', 'typeWindows', 'withBackgroundOverride');
      modules.profile = runtime.api.Webpack.getByKeys('header', 'footer', 'banner', 'backdrop', 'toast');
      modules.user = runtime.api.Webpack.getByKeys('avatar', 'nameTag', 'customStatus', 'emoji', 'buttons');
      modules.layout = runtime.api.Webpack.getByKeys('flex', 'horizontal', 'flexChild');
      modules.window = runtime.api.Webpack.getByKeys('appAsidePanelWrapper', 'mobileApp');
      modules.input = runtime.api.Webpack.getByKeys('channelTextArea', 'accessoryBar', 'emojiButton');
      modules.controls = runtime.api.Webpack.getByKeys('krispLogo', 'micTestButton', 'voiceButtonsContainer');
      modules.attachments = runtime.api.Webpack.getByKeys('channelAttachmentArea');
      modules.floating = runtime.api.Webpack.getByKeys('container', 'floating', 'chatTarget');
      modules.emptyState = runtime.api.Webpack.getByKeys('emptyState', 'emptyStateHeader', 'emptyStateIcon');
      modules.effects = runtime.api.Webpack.getByKeys('profileEffects', 'hovered', 'effect');
      modules.search = runtime.api.Webpack.getByKeys('searchResultsWrap', 'stillIndexing', 'noResults');
      modules.searchHeader = runtime.api.Webpack.getByKeys('searchHeader', 'searchHeaderTabList');
    }
    modules.threads = runtime.api.Webpack.getByKeys('uploadArea', 'newMemberBanner', 'mainCard', 'newPostsButton');
  };

  // Locates needed elements in the DOM
  locateElements = () => {
    elements.appBase = document.querySelector('.' + modules.sidebar?.base);
    elements.baseLayer = document.querySelector('.' + modules.layers?.baseLayer);
    elements.toolbar = document.querySelector('.' + modules.icons?.toolbar);
    elements.searchBar = document.querySelector('.' + modules.toolbar?.search);
    elements.inviteToolbar = document.querySelector('.' + modules.social?.inviteToolbar);
    elements.windowBar = document.querySelector('.' + modules.frame?.typeWindows.split(' ')[2]);
    elements.wordMark = document.querySelector('.' + modules.frame?.wordmarkWindows.split(' ')[1]);
    elements.messageInput = document.querySelector('.' + modules.guilds?.form);
    elements.userArea = document.querySelector('.' + modules.sidebar?.panels);
    elements.userProfile = document.querySelector('.' + modules.panel?.inner + '.' + modules.panel?.panel);
    elements.innerUserProfile = elements.userProfile?.firstElementChild;
    elements.userProfileFooter = document.querySelector('.' + modules.profile?.footer);
    elements.userProfileWrapper = document.querySelector('.' + modules.panel?.outer + '.' + modules.panel?.panel);
    elements.userProfileSVGWrapper = elements.userProfileWrapper?.querySelector('.' + modules.banner?.mask);
    elements.serverList = document.querySelector('.' + modules.servers?.wrapper);
    elements.channelList = document.querySelector('.' + modules.sidebar?.sidebar);
    elements.settingsContainerBase = document.querySelector('.' + modules.user?.container);
    elements.settingsContainer = elements.settingsContainerBase.querySelector('.' + modules.layout?.flex);
    elements.spotifyContainer = document.querySelector('.container_6sXIoE'); // SpotifyControls
    elements.outerAppWrapper = document.querySelector('.' + modules.window?.app);
    elements.avatarWrapper = document.querySelector('.' + modules.user?.avatarWrapper);
    elements.searchPanel = document.querySelector('.' + modules.search?.searchResultsWrap);
    elements.forumPopout = document.querySelector('.' + modules.floating?.floating + ':not(.' + modules.floating?.chatTarget.split(' ')[0] + ')');
    elements.forumPopoutTarget = document.querySelector('.' + modules.floating?.chatTarget.split(' ')[0]);
    elements.moreButton = elements.toolbar.querySelector('[d="M4 14a2 2 0 1 0 0-4 2 2'
      + ' 0 0 0 0 4Zm10-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 '
      + '0 0 1 4 0Z"]');
    elements.membersListButton = elements.toolbar.querySelector('[d="M14.5 8a3 3 0 1 '
      + '0-2.7-4.3c-.2.4.06.86.44 1.12a5 5 0 0 1 2.14 3.08c.01.06.06.1.12.1ZM'
      + '18.44 17.27c.15.43.54.73 1 .73h1.06c.83 0 1.5-.67 1.5-1.5a7.5 7.5 0 '
      + '0 0-6.5-7.43c-.55-.08-.99.38-1.1.92-.06.3-.15.6-.26.87-.23.58-.05 1.'
      + '3.47 1.63a9.53 9.53 0 0 1 3.83 4.78ZM12.5 9a3 3 0 1 1-6 0 3 3 0 0 1 '
      + '6 0ZM2 20.5a7.5 7.5 0 0 1 15 0c0 .83-.67 1.5-1.5 1.5a.2.2 0 0 1-.2-.'
      + '16c-.2-.96-.56-1.87-.88-2.54-.1-.23-.42-.15-.42.1v2.1a.5.5 0 0 1-.5.'
      + '5h-8a.5.5 0 0 1-.5-.5v-2.1c0-.25-.31-.33-.42-.1-.32.67-.67 1.58-.88 '
      + '2.54a.2.2 0 0 1-.2.16A1.5 1.5 0 0 1 2 20.5Z"]')?.parentElement.parentElement;
    elements.userProfileButton = elements.toolbar.querySelector('[d="M23 12.38c-.02.'
      + '38-.45.58-.78.4a6.97 6.97 0 0 0-6.27-.08.54.54 0 0 1-.44 0 8.97 8.97'
      + ' 0 0 0-11.16 3.55c-.1.15-.1.35 0 .5.37.58.8 1.13 1.28 1.61.24.24.64.'
      + '15.8-.15.19-.38.39-.73.58-1.02.14-.21.43-.1.4.15l-.19 1.96c-.02.19.0'
      + '7.37.23.47A8.96 8.96 0 0 0 12 21a.4.4 0 0 1 .38.27c.1.33.25.65.4.95.'
      + '18.34-.02.76-.4.77L12 23a11 11 0 1 1 11-10.62ZM15.5 7.5a3.5 3.5 0 1 '
      + '1-7 0 3.5 3.5 0 0 1 7 0Z"]')?.parentElement.parentElement;
    elements.fullscreenButton = document.querySelector('[d="M4 6c0-1.1.9-2 2-2h3a'
      + '1 1 0 0 0 0-2H6a4 4 0 0 0-4 4v3a1 1 0 0 0 2 0V6ZM4 18c0 1.1.9 2 2 2h'
      + '3a1 1 0 1 1 0 2H6a4 4 0 0 1-4-4v-3a1 1 0 1 1 2 0v3ZM18 4a2 2 0 0 1 2'
      + ' 2v3a1 1 0 1 0 2 0V6a4 4 0 0 0-4-4h-3a1 1 0 1 0 0 2h3ZM20 18a2 2 0 0'
      + ' 1-2 2h-3a1 1 0 1 0 0 2h3a4 4 0 0 0 4-4v-3a1 1 0 1 0-2 0v3Z"]')
      ?.parentElement.parentElement.parentElement;
    elements.callContainer = () => {
      return document.querySelector('.' + modules.callContainer?.wrapper + ':not(.' + modules.callContainer?.noChat + ')');
    };
    elements.messageInputButtonContainer = document.querySelector('.' + modules.input?.buttons);
    elements.innerMembersList = document.querySelector('.' + modules.members?.members);
    elements.membersListWrapper = document.querySelector('.' + modules.members?.container);
    elements.contentWindow = document.querySelector('.' + modules.guilds?.chatContent);
    if (!elements.contentWindow) {
      // In order to load threads module, we must be on a forum page
      // Unfortunately, module loads AFTER onSwitch() event, so we
      // have to kick off a listener to wait for it
      // CollapsibleUI may throw a few warnings when switching to forum
      // pages, but it shouldn't affect performance or functionality
      if (!modules.threads && !runtime.moduleLoader) {
        runtime.moduleLoader = setInterval(() => {
          this.locateModules(true);
          if (modules.threads) {
            clearInterval(runtime.moduleLoader);
            runtime.moduleLoader = null;
            this.initialize();
          }
        }, 100);
      }

      elements.contentWindow = document.querySelector('.' + modules.threads?.container);
    }
    elements.membersList = document.querySelector('.' + modules.members?.membersWrap);
    if (runtime.api.Plugins.isEnabled('ChannelDms') && document.querySelector('.ChannelDms-channelmembers-wrap'))
      elements.membersList = document.querySelector('.ChannelDms-channelmembers-wrap');
  };

  // Adds click handlers to toolbar icons
  addButtonClickHandlers = () => {
    var _this = this; // Abstract CollapsibleUI as a variable

    // Add event listener to the Server List button to
    //   update the icon, UI, & settings on click
    if (runtime.buttons[constants.I_SERVER_LIST]) {
      runtime.buttons[constants.I_SERVER_LIST].addEventListener('click', () => {
        _this.toggleButton(constants.I_SERVER_LIST);
      }, { signal: runtime.events.signal });

      runtime.buttons[constants.I_SERVER_LIST].tooltip = runtime.api.UI.createTooltip(
        runtime.buttons[constants.I_SERVER_LIST],
        runtime.localeLabels.serverList + ` (${
          settings.shortcutList[constants.I_SERVER_LIST]
            .map(e => e.charAt(0).toUpperCase() + e.slice(1)).join('+')
        })`,
        { side: 'bottom' },
      );
    }

    // Add event listener to the Channel List button to
    //   update the icon, UI, & settings on click
    if (runtime.buttons[constants.I_CHANNEL_LIST]) {
      runtime.buttons[constants.I_CHANNEL_LIST].addEventListener('click', () => {
        _this.toggleButton(constants.I_CHANNEL_LIST);
      }, { signal: runtime.events.signal });

      runtime.buttons[constants.I_CHANNEL_LIST].tooltip = runtime.api.UI.createTooltip(
        runtime.buttons[constants.I_CHANNEL_LIST],
        runtime.localeLabels.channelList + ` (${
          settings.shortcutList[constants.I_CHANNEL_LIST]
            .map(e => e.charAt(0).toUpperCase() + e.slice(1)).join('+')
        })`,
        { side: 'bottom' },
      );
    }

    // Add event listener to the Message Bar button to
    //   update the icon, UI, & settings on click
    if (runtime.buttons[constants.I_MESSAGE_INPUT]) {
      runtime.buttons[constants.I_MESSAGE_INPUT].addEventListener('click', () => {
        _this.toggleButton(constants.I_MESSAGE_INPUT);
      }, { signal: runtime.events.signal });

      runtime.buttons[constants.I_MESSAGE_INPUT].tooltip = runtime.api.UI.createTooltip(
        runtime.buttons[constants.I_MESSAGE_INPUT],
        runtime.localeLabels.messageInput + ` (${
          settings.shortcutList[constants.I_MESSAGE_INPUT]
            .map(e => e.charAt(0).toUpperCase() + e.slice(1)).join('+')
        })`,
        { side: 'bottom' },
      );
    }

    // Add event listener to the Window Bar button to
    //   update the icon, UI, & settings on click
    if (runtime.buttons[constants.I_WINDOW_BAR]) {
      runtime.buttons[constants.I_WINDOW_BAR].addEventListener('click', () => {
        _this.toggleButton(constants.I_WINDOW_BAR);
      }, { signal: runtime.events.signal });

      runtime.buttons[constants.I_WINDOW_BAR].tooltip = runtime.api.UI.createTooltip(
        runtime.buttons[constants.I_WINDOW_BAR],
        runtime.localeLabels.windowBar + ` (${
          settings.shortcutList[constants.I_WINDOW_BAR]
            .map(e => e.charAt(0).toUpperCase() + e.slice(1)).join('+')
        })`,
        { side: 'bottom' },
      );
    }

    // Add event listener to the Members List button to
    //   update the icon, UI, & settings on click
    if (runtime.buttons[constants.I_MEMBERS_LIST]) {
      runtime.buttons[constants.I_MEMBERS_LIST].addEventListener('click', () => {
        _this.toggleButton(constants.I_MEMBERS_LIST);
      }, { signal: runtime.events.signal });

      runtime.buttons[constants.I_MEMBERS_LIST].tooltip = runtime.api.UI.createTooltip(
        runtime.buttons[constants.I_MEMBERS_LIST],
        runtime.localeLabels.membersList + ` (${
          settings.shortcutList[constants.I_MEMBERS_LIST]
            .map(e => e.charAt(0).toUpperCase() + e.slice(1)).join('+')
        })`,
        { side: 'bottom' },
      );
    }

    // Add event listener to the User Profile button to
    //   update the icon, UI, & settings on click
    if (runtime.buttons[constants.I_USER_PROFILE]) {
      runtime.buttons[constants.I_USER_PROFILE].addEventListener('click', () => {
        _this.toggleButton(constants.I_USER_PROFILE);
      }, { signal: runtime.events.signal });

      runtime.buttons[constants.I_USER_PROFILE].tooltip = runtime.api.UI.createTooltip(
        runtime.buttons[constants.I_USER_PROFILE],
        runtime.localeLabels.userProfile + ` (${
          settings.shortcutList[constants.I_USER_PROFILE]
            .map(e => e.charAt(0).toUpperCase() + e.slice(1)).join('+')
        })`,
        { side: 'bottom' },
      );
    }

    // Add event listener to the User Area button to
    //   update the icon, UI, & settings on click
    if (runtime.buttons[constants.I_USER_AREA]) {
      runtime.buttons[constants.I_USER_AREA].addEventListener('click', () => {
        _this.toggleButton(constants.I_USER_AREA);
      }, { signal: runtime.events.signal });

      runtime.buttons[constants.I_USER_AREA].tooltip = runtime.api.UI.createTooltip(
        runtime.buttons[constants.I_USER_AREA],
        runtime.localeLabels.userArea + ` (${
          settings.shortcutList[constants.I_USER_AREA]
            .map(e => e.charAt(0).toUpperCase() + e.slice(1)).join('+')
        })`,
        { side: 'bottom' },
      );
    }

    // Add event listener to the Call Container button to
    //   update the icon, UI, & settings on click
    if (runtime.buttons[constants.I_CALL_WINDOW]) {
      runtime.buttons[constants.I_CALL_WINDOW].addEventListener('click', () => {
        _this.toggleButton(constants.I_CALL_WINDOW);
      }, { signal: runtime.events.signal });

      runtime.buttons[constants.I_CALL_WINDOW].tooltip = runtime.api.UI.createTooltip(
        runtime.buttons[constants.I_CALL_WINDOW],
        runtime.localeLabels.callWindow + ` (${
          settings.shortcutList[constants.I_CALL_WINDOW]
            .map(e => e.charAt(0).toUpperCase() + e.slice(1)).join('+')
        })`,
        { side: 'bottom' },
      );
    }
  };

  // Adds miscellaneous event listeners
  addMiscEventListeners = (buttonsActive, settingsButtons, singleButtonWidth) => {
    var _this = this; // Abstract CollapsibleUI as a variable

    // Implement dynamic uncollapse features
    if (settings.expandOnHover) {
      // Update autocollapse conditionals
      this.applyCollapseConditionals();

      // Add event listener to window to autocollapse elements if window becomes too small
      // If you have to read this, I'm so sorry
      if (settings.sizeCollapse) {
        window.addEventListener('resize', (e) => {
          if (runtime.buttons[constants.I_SERVER_LIST]
            && ((settings.collapseConditionals[constants.I_SERVER_LIST] === '')
            || !(settings.conditionalCollapse))
            && (((runtime.themes.horizontalServerList ? window.outerHeight : window.outerWidth)
            < settings.sizeCollapseThreshold[constants.I_SERVER_LIST]
            && runtime.api.Data.load('server-list-button-active'))
            || ((runtime.themes.horizontalServerList ? window.outerHeight : window.outerWidth)
            > settings.sizeCollapseThreshold[constants.I_SERVER_LIST]
            && !runtime.api.Data.load('server-list-button-active')))) {
            _this.toggleButton(constants.I_SERVER_LIST);
          }
          if (runtime.buttons[constants.I_CHANNEL_LIST]
            && ((settings.collapseConditionals[constants.I_CHANNEL_LIST] === '')
            || !(settings.conditionalCollapse))
            && ((window.outerWidth < settings.sizeCollapseThreshold[constants.I_CHANNEL_LIST]
            && runtime.api.Data.load('channel-list-button-active'))
            || (window.outerWidth > settings.sizeCollapseThreshold[constants.I_CHANNEL_LIST]
            && !runtime.api.Data.load('channel-list-button-active')))) {
            _this.toggleButton(constants.I_CHANNEL_LIST);
          }
          if (runtime.buttons[constants.I_MESSAGE_INPUT]
            && ((settings.collapseConditionals[constants.I_MESSAGE_INPUT] === '')
            || !(settings.conditionalCollapse))
            && ((window.outerHeight < settings.sizeCollapseThreshold[constants.I_MESSAGE_INPUT]
            && runtime.api.Data.load('message-input-button-active'))
            || (window.outerHeight > settings.sizeCollapseThreshold[constants.I_MESSAGE_INPUT]
            && !runtime.api.Data.load('message-input-button-active')))) {
            _this.toggleButton(constants.I_MESSAGE_INPUT);
          }
          if (runtime.buttons[constants.I_WINDOW_BAR]
            && ((settings.collapseConditionals[constants.I_WINDOW_BAR] === '')
            || !(settings.conditionalCollapse))
            && ((window.outerHeight < settings.sizeCollapseThreshold[constants.I_WINDOW_BAR]
            && runtime.api.Data.load('window-bar-button-active'))
            || (window.outerHeight > settings.sizeCollapseThreshold[constants.I_WINDOW_BAR]
            && !runtime.api.Data.load('window-bar-button-active')))) {
            _this.toggleButton(constants.I_WINDOW_BAR);
          }
          if (runtime.buttons[constants.I_MEMBERS_LIST]
            && ((settings.collapseConditionals[constants.I_MEMBERS_LIST] === '')
            || !(settings.conditionalCollapse))
            && ((window.outerWidth < settings.sizeCollapseThreshold[constants.I_MEMBERS_LIST]
            && runtime.api.Data.load('members-list-button-active'))
            || (window.outerWidth > settings.sizeCollapseThreshold[constants.I_MEMBERS_LIST]
            && !runtime.api.Data.load('members-list-button-active')))) {
            _this.toggleButton(constants.I_MEMBERS_LIST);
          }
          if (runtime.buttons[constants.I_USER_PROFILE]
            && ((settings.collapseConditionals[constants.I_USER_PROFILE] === '')
            || !(settings.conditionalCollapse))
            && ((window.outerWidth < settings.sizeCollapseThreshold[constants.I_USER_PROFILE]
            && runtime.api.Data.load('user-profile-button-active'))
            || (window.outerWidth > settings.sizeCollapseThreshold[constants.I_USER_PROFILE]
            && !runtime.api.Data.load('user-profile-button-active')))) {
            _this.toggleButton(constants.I_USER_PROFILE);
          }
          if (runtime.buttons[constants.I_USER_AREA]
            && ((settings.collapseConditionals[constants.I_USER_AREA] === '')
            || !(settings.conditionalCollapse))
            && ((window.outerHeight < settings.sizeCollapseThreshold[constants.I_USER_AREA]
            && runtime.api.Data.load('user-area-button-active'))
            || (window.outerHeight > settings.sizeCollapseThreshold[constants.I_USER_AREA]
            && !runtime.api.Data.load('user-area-button-active')))) {
            _this.toggleButton(constants.I_USER_AREA);
          }
          if (runtime.buttons[constants.I_CALL_WINDOW]
            && ((settings.collapseConditionals[constants.I_CALL_WINDOW] === '')
            || !(settings.conditionalCollapse))
            && ((window.outerHeight < settings.sizeCollapseThreshold[constants.I_CALL_WINDOW]
            && runtime.api.Data.load('call-window-button-active'))
            || (window.outerHeight > settings.sizeCollapseThreshold[constants.I_CALL_WINDOW]
            && !runtime.api.Data.load('call-window-button-active')))) {
            _this.toggleButton(constants.I_CALL_WINDOW);
          }
        }, { signal: runtime.events.signal });
      }

      // Add event listener to document body to track cursor location
      //   and check if it is near collapsed elements
      document.body.addEventListener('mousemove', (e) => {
        runtime.mouse.x = e.pageX;
        runtime.mouse.y = e.pageY;

        _this.initThemeIntegration();
        _this.tickExpandOnHover(settingsButtons, buttonsActive, singleButtonWidth);
      }, { signal: runtime.events.signal });

      document.body.addEventListener('mouseleave', () => {
        // Server List
        if ((!runtime.api.Data.load('server-list-button-active'))
          && elements.serverList) {
          if (runtime.delays[constants.I_SERVER_LIST]) {
            clearTimeout(runtime.delays[constants.I_SERVER_LIST]);
            runtime.delays[constants.I_SERVER_LIST] = false;
          }
          if (!runtime.themes.horizontalServerList) {
            elements.serverList.style.setProperty('width', settings.collapseSize + 'px', 'important');
            if (runtime.themes.darkMatter) {
              elements.settingsContainerBase.style.setProperty('width', '100%', 'important');
              elements.settingsContainerBase.style.setProperty('left', '0px', 'important');
              elements.appBase.style.setProperty('min-width', '100vw', 'important');
            }
            runtime.collapsed[constants.I_SERVER_LIST] = true;
          }
        }

        // Channel List
        if ((!runtime.api.Data.load('channel-list-button-active'))
          && elements.channelList) {
          if (runtime.delays[constants.I_CHANNEL_LIST]) {
            clearTimeout(runtime.delays[constants.I_CHANNEL_LIST]);
            runtime.delays[constants.I_CHANNEL_LIST] = false;
          }
          elements.channelList.style.setProperty('transition', 'width ' + settings.transitionSpeed + 'ms', 'important');
          elements.channelList.style.setProperty('width', settings.collapseSize + 'px', 'important');
          if (runtime.themes.darkMatter) {
            elements.settingsContainer.style.setProperty('display', 'none', 'important');
            if (elements.spotifyContainer)
              elements.spotifyContainer.style.setProperty('display', 'none', 'important');
          }
          runtime.collapsed[constants.I_CHANNEL_LIST] = true;
        }

        // Message Bar
        if ((!runtime.api.Data.load('message-input-button-active'))
          && elements.messageInput
          && !(document.querySelector('[data-slate-string="true"]')?.innerHTML)
          && !(document.querySelector('.' + modules.attachments?.channelAttachmentArea))
          && !(document.querySelector('.' + modules.input?.expressionPickerPositionLayer))
          && !(document.querySelector('#channel-attach'))) {
          if (runtime.delays[constants.I_MESSAGE_INPUT]) {
            clearTimeout(runtime.delays[constants.I_MESSAGE_INPUT]);
            runtime.delays[constants.I_MESSAGE_INPUT] = false;
          }
          elements.messageInput.style.setProperty('max-height', settings.collapseSize + 'px', 'important');
          elements.messageInput.style.setProperty('overflow', 'hidden', 'important');
          runtime.collapsed[constants.I_MESSAGE_INPUT] = true;
        }

        // Window Bar
        if ((!runtime.api.Data.load('window-bar-button-active'))
          && elements.windowBar
          && (runtime.mouse.y > settings.windowBarHeight + settings.expandOnHoverClosingFudgeFactor)) {
          if (runtime.delays[constants.I_WINDOW_BAR]) {
            clearTimeout(runtime.delays[constants.I_WINDOW_BAR]);
            runtime.delays[constants.I_WINDOW_BAR] = false;
          }
          elements.windowBar.style.setProperty('height', '0px', 'important');
          if (runtime.themes.darkMatter)
            elements.windowBar.style.setProperty('opacity', '0', 'important');
          elements.windowBar.style.setProperty('padding', '0px', 'important');
          elements.windowBar.style.setProperty('margin', '0px', 'important');
          elements.windowBar.style.setProperty('overflow', 'hidden', 'important');
          elements.wordMark?.style.setProperty('display', 'none', 'important');
          runtime.collapsed[constants.I_WINDOW_BAR] = true;
        }

        // Members List
        if ((!runtime.api.Data.load('members-list-button-active'))
          && elements.membersList
          && !(_this.isNear(document.querySelector('.' + modules.panel?.outer + '.' + modules.panel?.panel), 10000, runtime.mouse.x, runtime.mouse.y))) {
          if (runtime.delays[constants.I_MEMBERS_LIST]) {
            clearTimeout(runtime.delays[constants.I_MEMBERS_LIST]);
            runtime.delays[constants.I_MEMBERS_LIST] = false;
          }
          elements.membersList.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
          elements.contentWindow.style.setProperty('transition', 'max-width ' + settings.transitionSpeed + 'ms', 'important');
          elements.membersList.style.setProperty('width', settings.collapseSize + 'px', 'important');
          elements.membersList.style.setProperty('min-width', settings.collapseSize + 'px', 'important');
          elements.contentWindow.style.setProperty('max-width', 'calc(100% - ' + settings.collapseSize + 'px)', 'important');
          runtime.collapsed[constants.I_MEMBERS_LIST] = true;
        }

        // Profile Panel
        if ((!runtime.api.Data.load('user-profile-button-active'))
          && elements.userProfile && !(_this.isNear(document.querySelector('.' + modules.panel?.outer + '.' + modules.panel?.panel), 10000, runtime.mouse.x, runtime.mouse.y))) {
          if (runtime.delays[constants.I_USER_PROFILE]) {
            clearTimeout(runtime.delays[constants.I_USER_PROFILE]);
            runtime.delays[constants.I_USER_PROFILE] = false;
          }
          elements.userProfile.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
          elements.userProfile.style.setProperty('width', settings.collapseSize + 'px', 'important');
          runtime.collapsed[constants.I_USER_PROFILE] = true;
        }

        // User Area
        if ((!runtime.api.Data.load('user-area-button-active'))
          && elements.userArea) {
          if (runtime.delays[constants.I_USER_AREA]) {
            clearTimeout(runtime.delays[constants.I_USER_AREA]);
            runtime.delays[constants.I_USER_AREA] = false;
          }
          elements.userArea.style.setProperty('max-height', settings.collapseSize + 'px', 'important');
          runtime.collapsed[constants.I_USER_AREA] = true;
        }

        // Call Container
        if ((!runtime.api.Data.load('call-window-button-active'))
          && elements.callContainer()) {
          if (runtime.delays[constants.I_CALL_WINDOW]) {
            clearTimeout(runtime.delays[constants.I_CALL_WINDOW]);
            runtime.delays[constants.I_CALL_WINDOW] = false;
          }
          elements.callContainer().style.setProperty('max-height', '0px', 'important');
          runtime.collapsed[constants.I_CALL_WINDOW] = true;
        }
      }, { signal: runtime.events.signal });

      window.addEventListener('keyup', (e) => {
        if ((!runtime.api.Data.load('message-input-button-active'))
          && elements.messageInput && settings.expandOnHoverEnabled[constants.I_MESSAGE_INPUT]) {
          if (runtime.collapsed[constants.I_MESSAGE_INPUT]
            && (document.querySelector('[data-slate-string="true"]')?.innerHTML
            || document.querySelector('.' + modules.attachments?.channelAttachmentArea)
            || document.querySelector('.' + modules.input?.expressionPickerPositionLayer)
            || document.querySelector('#channel-attach'))) {
            if (runtime.delays[constants.I_MESSAGE_INPUT]) {
              clearTimeout(runtime.delays[constants.I_MESSAGE_INPUT]);
              runtime.delays[constants.I_MESSAGE_INPUT] = false;
            }
            elements.messageInput.style.setProperty('max-height', settings.messageInputMaxHeight + 'px', 'important');
            elements.messageInput.style.removeProperty('overflow');
            runtime.collapsed[constants.I_MESSAGE_INPUT] = false;
          }
          else if (!(runtime.collapsed[constants.I_MESSAGE_INPUT])
            && !(document.querySelector('[data-slate-string="true"]')?.innerHTML)
            && !(document.querySelector('.' + modules.attachments?.channelAttachmentArea))
            && !(document.querySelector('.' + modules.input?.expressionPickerPositionLayer))
            && !(document.querySelector('#channel-attach'))) {
            if (runtime.delays[constants.I_MESSAGE_INPUT]) {
              clearTimeout(runtime.delays[constants.I_MESSAGE_INPUT]);
              runtime.delays[constants.I_MESSAGE_INPUT] = false;
            }
            elements.messageInput.style.setProperty('max-height', settings.collapseSize + 'px', 'important');
            elements.messageInput.style.setProperty('overflow', 'hidden', 'important');
            runtime.collapsed[constants.I_MESSAGE_INPUT] = true;
          }
        }
      }, { signal: runtime.events.signal });

      // Add event listeners to the Toolbar to update on hover
      if (settings.collapseToolbar === 'all') {
        elements.toolbar.addEventListener('mouseenter', () => {
          elements.toolbar.style.setProperty('max-width', settings.toolbarMaxWidth + 'px', 'important');
        }, { signal: runtime.events.signal });
      }

      // Add event listeners to the Toolbar Container to update on hover
      if (settings.collapseToolbar) {
        elements.toolbarContainer.addEventListener('mouseenter', () => {
          if (runtime.buttons[constants.I_SERVER_LIST]) {
            runtime.buttons[constants.I_SERVER_LIST].style
              .setProperty('max-width', settings.toolbarButtonsMaxWidth + 'px', 'important');
            runtime.buttons[constants.I_SERVER_LIST].style.removeProperty('margin');
            runtime.buttons[constants.I_SERVER_LIST].style.removeProperty('padding');
          }
          if (runtime.buttons[constants.I_CHANNEL_LIST]) {
            runtime.buttons[constants.I_CHANNEL_LIST].style
              .setProperty('max-width', settings.toolbarButtonsMaxWidth + 'px', 'important');
            runtime.buttons[constants.I_CHANNEL_LIST].style.removeProperty('margin');
            runtime.buttons[constants.I_CHANNEL_LIST].style.removeProperty('padding');
          }
          if (runtime.buttons[constants.I_MESSAGE_INPUT]) {
            runtime.buttons[constants.I_MESSAGE_INPUT].style
              .setProperty('max-width', settings.toolbarButtonsMaxWidth + 'px', 'important');
            runtime.buttons[constants.I_MESSAGE_INPUT].style.removeProperty('margin');
            runtime.buttons[constants.I_MESSAGE_INPUT].style.removeProperty('padding');
          }
          if (runtime.buttons[constants.I_WINDOW_BAR]) {
            runtime.buttons[constants.I_WINDOW_BAR].style
              .setProperty('max-width', settings.toolbarButtonsMaxWidth + 'px', 'important');
            runtime.buttons[constants.I_WINDOW_BAR].style.removeProperty('margin');
            runtime.buttons[constants.I_WINDOW_BAR].style.removeProperty('padding');
          }
          if (runtime.buttons[constants.I_MEMBERS_LIST]) {
            runtime.buttons[constants.I_MEMBERS_LIST].style
              .setProperty('max-width', settings.toolbarButtonsMaxWidth + 'px', 'important');
            runtime.buttons[constants.I_MEMBERS_LIST].style.removeProperty('margin');
            runtime.buttons[constants.I_MEMBERS_LIST].style.removeProperty('padding');
          }
          if (runtime.buttons[constants.I_USER_AREA]) {
            runtime.buttons[constants.I_USER_AREA].style
              .setProperty('max-width', settings.toolbarButtonsMaxWidth + 'px', 'important');
            runtime.buttons[constants.I_USER_AREA].style.removeProperty('margin');
            runtime.buttons[constants.I_USER_AREA].style.removeProperty('padding');
          }
          if (runtime.buttons[constants.I_CALL_WINDOW]) {
            runtime.buttons[constants.I_CALL_WINDOW].style
              .setProperty('max-width', settings.toolbarButtonsMaxWidth + 'px', 'important');
            runtime.buttons[constants.I_CALL_WINDOW].style.removeProperty('margin');
            runtime.buttons[constants.I_CALL_WINDOW].style.removeProperty('padding');
          }
          if (runtime.buttons[constants.I_USER_PROFILE]) {
            runtime.buttons[constants.I_USER_PROFILE].style
              .setProperty('max-width', settings.toolbarButtonsMaxWidth + 'px', 'important');
            runtime.buttons[constants.I_USER_PROFILE].style.removeProperty('margin');
            runtime.buttons[constants.I_USER_PROFILE].style.removeProperty('padding');
          }
        }, { signal: runtime.events.signal });
      }

      // Add event listeners to the Settings Container to update on hover
      if (settings.collapseSettings) {
        elements.settingsContainer.addEventListener('mouseenter', () => {
          for (var i = 0; i < (settingsButtons.length - 1); i++) {
            settingsButtons[i].style
              .setProperty('max-width', settings.settingsButtonsMaxWidth + 'px', 'important');
          }
        }, { signal: runtime.events.signal });
      }

      // Add event listeners to the Message Bar Button Container to update on hover
      if ((settings.messageInputCollapse) && elements.messageInputButtonContainer) {
        elements.messageInputButtonContainer.addEventListener('mouseenter', () => {
          elements.messageInputButtonContainer.style.setProperty('max-width', settings.messageInputButtonsMaxWidth + 'px', 'important');
        }, { signal: runtime.events.signal });
      }
    }

    // Add event listener to detect keyboard shortcuts
    if (settings.keyboardShortcuts) {
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.altKey || e.shiftKey) && (e.key !== 'Dead')) {
          for (var i = 0; i < settings.buttonIndexes.length; i++) {
            var keyStates = [false, false, false, null];

            if (settings.shortcutList[i].includes('Control'))
              keyStates[0] = true;
            if (settings.shortcutList[i].includes('Alt'))
              keyStates[1] = true;
            if (settings.shortcutList[i].includes('Shift'))
              keyStates[2] = true;

            keyStates[3] = settings.shortcutList[i][settings.shortcutList[i].length - 1].toLowerCase();

            if (e.ctrlKey === keyStates[0] && e.altKey === keyStates[1]
              && e.shiftKey === keyStates[2] && e.key.toLowerCase() === keyStates[3]) {
              _this.toggleButton(i);
              e.preventDefault();
            }
          }
        }
      }, { signal: runtime.events.signal });
    }
  };

  // Adds a new SVG icon to the toolbar
  addToolbarIcon = (ariaLabel, rawSVGData, viewBox) => {
    // Create the icon and define properties
    var newToolbarIcon = document.createElement('div');
    newToolbarIcon.classList.add(modules.icons?.iconWrapper);
    newToolbarIcon.classList.add(modules.icons?.clickable);
    newToolbarIcon.classList.add('collapsible-ui-element');
    newToolbarIcon.setAttribute('role', 'button');
    newToolbarIcon.setAttribute('aria-label', ariaLabel);
    newToolbarIcon.setAttribute('tabindex', '0');
    newToolbarIcon.style.setProperty('display', 'inline-block', 'important');
    newToolbarIcon.style.setProperty('overflow', 'hidden', 'important');
    newToolbarIcon.innerHTML = `<svg x="0" y="0" class="${modules.icons?.icon}" `
      + `aria-hidden="false" width="24" height="24" viewBox="${viewBox}">`
      + `${rawSVGData}</svg>`;

    // Insert icon to the left of the search bar
    document.getElementById('cui-toolbar-container')
      .insertBefore(newToolbarIcon, document.getElementById('cui-icon-insert-point'));

    // Return DOM Element of newly-created toolbar icon
    return newToolbarIcon;
  };

  // Collapses elements if user-specified conditionals are met
  applyCollapseConditionals = () => {
    if (settings.conditionalCollapse) {
      if ((settings.collapseConditionals[constants.I_SERVER_LIST] !== '')
        && ((eval(settings.collapseConditionals[constants.I_SERVER_LIST])
        && (runtime.api.Data.load('server-list-button-active')))
        || (!eval(settings.collapseConditionals[constants.I_SERVER_LIST])
        && (!runtime.api.Data.load('server-list-button-active')))))
        this.toggleButton(constants.I_SERVER_LIST);

      if ((settings.collapseConditionals[constants.I_CHANNEL_LIST] !== '')
        && ((eval(settings.collapseConditionals[constants.I_CHANNEL_LIST])
        && (runtime.api.Data.load('channel-list-button-active')))
        || (!eval(settings.collapseConditionals[constants.I_CHANNEL_LIST])
        && (!runtime.api.Data.load('channel-list-button-active')))))
        this.toggleButton(constants.I_CHANNEL_LIST);

      if ((settings.collapseConditionals[constants.I_MESSAGE_INPUT] !== '')
        && ((eval(settings.collapseConditionals[constants.I_MESSAGE_INPUT])
        && (runtime.api.Data.load('message-input-button-active')))
        || (!eval(settings.collapseConditionals[constants.I_MESSAGE_INPUT])
        && (!runtime.api.Data.load('message-input-button-active')))))
        this.toggleButton(constants.I_MESSAGE_INPUT);

      if ((settings.collapseConditionals[constants.I_WINDOW_BAR] !== '')
        && ((eval(settings.collapseConditionals[constants.I_WINDOW_BAR])
        && (runtime.api.Data.load('window-bar-button-active')))
        || (!eval(settings.collapseConditionals[constants.I_WINDOW_BAR])
        && (!runtime.api.Data.load('window-bar-button-active')))))
        this.toggleButton(constants.I_WINDOW_BAR);

      if ((settings.collapseConditionals[constants.I_MEMBERS_LIST] !== '')
        && ((eval(settings.collapseConditionals[constants.I_MEMBERS_LIST])
        && (runtime.api.Data.load('members-list-button-active')))
        || (!eval(settings.collapseConditionals[constants.I_MEMBERS_LIST])
        && (!runtime.api.Data.load('members-list-button-active')))))
        this.toggleButton(constants.I_MEMBERS_LIST);

      if ((settings.collapseConditionals[constants.I_USER_PROFILE] !== '')
        && ((eval(settings.collapseConditionals[constants.I_USER_PROFILE])
        && (runtime.api.Data.load('user-profile-button-active')))
        || (!eval(settings.collapseConditionals[constants.I_USER_PROFILE])
        && (!runtime.api.Data.load('user-profile-button-active')))))
        this.toggleButton(constants.I_USER_PROFILE);

      if ((settings.collapseConditionals[constants.I_USER_AREA] !== '')
        && ((eval(settings.collapseConditionals[constants.I_USER_AREA])
        && (runtime.api.Data.load('user-area-button-active')))
        || (!eval(settings.collapseConditionals[constants.I_USER_AREA])
        && (!runtime.api.Data.load('user-area-button-active')))))
        this.toggleButton(constants.I_USER_AREA);

      if ((settings.collapseConditionals[constants.I_CALL_WINDOW] !== '')
        && ((eval(settings.collapseConditionals[constants.I_CALL_WINDOW])
        && (runtime.api.Data.load('call-window-button-active')))
        || (!eval(settings.collapseConditionals[constants.I_CALL_WINDOW])
        && (!runtime.api.Data.load('call-window-button-active')))))
        this.toggleButton(constants.I_CALL_WINDOW);
    }
  };

  // Collapses toolbar icons
  collapseToolbarIcons = (buttonsActive) => {
    if (runtime.buttons[constants.I_SERVER_LIST]) {
      runtime.buttons[constants.I_SERVER_LIST].style.setProperty('max-width', '0px', 'important');
      runtime.buttons[constants.I_SERVER_LIST].style.setProperty('margin', '0px', 'important');
      runtime.buttons[constants.I_SERVER_LIST].style.setProperty('padding', '0px', 'important');
    }
    if (runtime.buttons[constants.I_CHANNEL_LIST]) {
      runtime.buttons[constants.I_CHANNEL_LIST].style.setProperty('max-width', '0px', 'important');
      runtime.buttons[constants.I_CHANNEL_LIST].style.setProperty('margin', '0px', 'important');
      runtime.buttons[constants.I_CHANNEL_LIST].style.setProperty('padding', '0px', 'important');
    }
    if (runtime.buttons[constants.I_MESSAGE_INPUT]) {
      runtime.buttons[constants.I_MESSAGE_INPUT].style.setProperty('max-width', '0px', 'important');
      runtime.buttons[constants.I_MESSAGE_INPUT].style.setProperty('margin', '0px', 'important');
      runtime.buttons[constants.I_MESSAGE_INPUT].style.setProperty('padding', '0px', 'important');
    }
    if (runtime.buttons[constants.I_WINDOW_BAR]) {
      runtime.buttons[constants.I_WINDOW_BAR].style.setProperty('max-width', '0px', 'important');
      runtime.buttons[constants.I_WINDOW_BAR].style.setProperty('margin', '0px', 'important');
      runtime.buttons[constants.I_WINDOW_BAR].style.setProperty('padding', '0px', 'important');
    }
    if (runtime.buttons[constants.I_MEMBERS_LIST]) {
      runtime.buttons[constants.I_MEMBERS_LIST].style.setProperty('max-width', '0px', 'important');
      runtime.buttons[constants.I_MEMBERS_LIST].style.setProperty('margin', '0px', 'important');
      runtime.buttons[constants.I_MEMBERS_LIST].style.setProperty('padding', '0px', 'important');
    }
    if (runtime.buttons[constants.I_USER_AREA]) {
      runtime.buttons[constants.I_USER_AREA].style.setProperty('max-width', '0px', 'important');
      runtime.buttons[constants.I_USER_AREA].style.setProperty('margin', '0px', 'important');
      runtime.buttons[constants.I_USER_AREA].style.setProperty('padding', '0px', 'important');
    }
    if (runtime.buttons[constants.I_CALL_WINDOW]) {
      runtime.buttons[constants.I_CALL_WINDOW].style.setProperty('max-width', '0px', 'important');
      runtime.buttons[constants.I_CALL_WINDOW].style.setProperty('margin', '0px', 'important');
      runtime.buttons[constants.I_CALL_WINDOW].style.setProperty('padding', '0px', 'important');
    }
    if (runtime.buttons[constants.I_USER_PROFILE]) {
      runtime.buttons[constants.I_USER_PROFILE].style.setProperty('max-width', '0px', 'important');
      runtime.buttons[constants.I_USER_PROFILE].style.setProperty('margin', '0px', 'important');
      runtime.buttons[constants.I_USER_PROFILE].style.setProperty('padding', '0px', 'important');
    }

    if (runtime.buttons[constants.I_MEMBERS_LIST] && (buttonsActive[constants.I_MEMBERS_LIST]
      === Math.max.apply(Math, buttonsActive))) {
      runtime.buttons[constants.I_MEMBERS_LIST].style
        .setProperty('max-width', settings.toolbarButtonsMaxWidth + 'px', 'important');
      runtime.buttons[constants.I_MEMBERS_LIST].style.removeProperty('margin');
      runtime.buttons[constants.I_MEMBERS_LIST].style.removeProperty('padding');
    }
    else if (runtime.buttons[constants.I_WINDOW_BAR] && (buttonsActive[constants.I_WINDOW_BAR]
      === Math.max.apply(Math, buttonsActive))) {
      runtime.buttons[constants.I_WINDOW_BAR].style
        .setProperty('max-width', settings.toolbarButtonsMaxWidth + 'px', 'important');
      runtime.buttons[constants.I_WINDOW_BAR].style.removeProperty('margin');
      runtime.buttons[constants.I_WINDOW_BAR].style.removeProperty('padding');
    }
    else if (runtime.buttons[constants.I_MESSAGE_INPUT] && (buttonsActive[constants.I_MESSAGE_INPUT]
      === Math.max.apply(Math, buttonsActive))) {
      runtime.buttons[constants.I_MESSAGE_INPUT].style
        .setProperty('max-width', settings.toolbarButtonsMaxWidth + 'px', 'important');
      runtime.buttons[constants.I_MESSAGE_INPUT].style.removeProperty('margin');
      runtime.buttons[constants.I_MESSAGE_INPUT].style.removeProperty('padding');
    }
    else if (runtime.buttons[constants.I_CHANNEL_LIST] && (buttonsActive[constants.I_CHANNEL_LIST]
      === Math.max.apply(Math, buttonsActive))) {
      runtime.buttons[constants.I_CHANNEL_LIST].style
        .setProperty('max-width', settings.toolbarButtonsMaxWidth + 'px', 'important');
      runtime.buttons[constants.I_CHANNEL_LIST].style.removeProperty('margin');
      runtime.buttons[constants.I_CHANNEL_LIST].style.removeProperty('padding');
    }
    else if (runtime.buttons[constants.I_SERVER_LIST] && (buttonsActive[constants.I_SERVER_LIST]
      === Math.max.apply(Math, buttonsActive))) {
      runtime.buttons[constants.I_SERVER_LIST].style
        .setProperty('max-width', settings.toolbarButtonsMaxWidth + 'px', 'important');
      runtime.buttons[constants.I_SERVER_LIST].style.removeProperty('margin');
      runtime.buttons[constants.I_SERVER_LIST].style.removeProperty('padding');
    }
    else if (runtime.buttons[constants.I_USER_AREA] && (buttonsActive[constants.I_USER_AREA]
      === Math.max.apply(Math, buttonsActive))) {
      runtime.buttons[constants.I_USER_AREA].style
        .setProperty('max-width', settings.toolbarButtonsMaxWidth + 'px', 'important');
      runtime.buttons[constants.I_USER_AREA].style.removeProperty('margin');
      runtime.buttons[constants.I_USER_AREA].style.removeProperty('padding');
    }
    else if (runtime.buttons[constants.I_CALL_WINDOW] && (buttonsActive[constants.I_CALL_WINDOW]
      === Math.max.apply(Math, buttonsActive))) {
      runtime.buttons[constants.I_CALL_WINDOW].style
        .setProperty('max-width', settings.toolbarButtonsMaxWidth + 'px', 'important');
      runtime.buttons[constants.I_CALL_WINDOW].style.removeProperty('margin');
      runtime.buttons[constants.I_CALL_WINDOW].style.removeProperty('padding');
    }
    else if (runtime.buttons[constants.I_USER_PROFILE] && (buttonsActive[constants.I_USER_PROFILE]
      === Math.max.apply(Math, buttonsActive))) {
      runtime.buttons[constants.I_USER_PROFILE].style
        .setProperty('max-width', settings.toolbarButtonsMaxWidth + 'px', 'important');
      runtime.buttons[constants.I_USER_PROFILE].style.removeProperty('margin');
      runtime.buttons[constants.I_USER_PROFILE].style.removeProperty('padding');
    }
    else {
      document.querySelectorAll('.collapsible-ui-element')
        .forEach(e => e.style.setProperty('display', 'none'), 'important');
    }
  };

  // Sets the floating status of an element by index
  floatElement = (index, floating) => {
    // Disable floating if elements should remain partially uncollapsed
    if (settings.collapseSize > 0) floating = false;

    switch (index) {
      case 0: // constants.I_SERVER_LIST
        if (floating && settings.floatingPanels) {
          elements.serverList.style.setProperty('position', 'absolute', 'important');
          elements.serverList.style.setProperty('z-index', '191', 'important');
          elements.serverList.style.setProperty('min-height', '100%', 'important');
          elements.serverList.style.setProperty('overflow-y', 'scroll', 'important');
          if (runtime.themes.horizontalServerList) {
            elements.serverList.style.setProperty('max-height', '100vw', 'important');
          }
          else {
            elements.serverList.style.setProperty('max-height', '100%', 'important');
          }
        }
        else {
          elements.serverList.style.removeProperty('position');
          elements.serverList.style.removeProperty('z-index');
          elements.serverList.style.removeProperty('max-height');
          elements.serverList.style.removeProperty('min-height');
          elements.serverList.style.removeProperty('overflow-y');
        }
        break;

      case 1: // constants.I_CHANNEL_LIST
        if (floating && settings.floatingPanels) {
          elements.channelList.style.setProperty('position', 'absolute', 'important');
          elements.channelList.style.setProperty('z-index', '190', 'important');
          elements.channelList.style.setProperty('max-height', '100%', 'important');
          elements.channelList.style.setProperty('height', '100%', 'important');
        }
        else {
          elements.channelList.style.removeProperty('position');
          elements.channelList.style.removeProperty('z-index');
          elements.channelList.style.removeProperty('max-height');
          elements.channelList.style.removeProperty('height');
        }
        break;

      case 2: // constants.I_MESSAGE_INPUT
      // Element is unable to be properly floated
        break;

      case 3: // constants.I_WINDOW_BAR
      // Floating this element doesn't make sense
        break;

      case 4: // constants.I_MEMBERS_LIST
        if (floating && settings.floatingPanels) {
          elements.membersList.style.setProperty('position', 'absolute', 'important');
          elements.membersList.style.setProperty('z-index', '190', 'important');
          elements.membersList.style.setProperty('max-height', '100%', 'important');
          elements.membersList.style.setProperty('height', '100%', 'important');
          elements.membersList.style.setProperty('right', '0', 'important');
        }
        else {
          elements.membersList.style.removeProperty('position');
          elements.membersList.style.removeProperty('z-index');
          elements.membersList.style.removeProperty('max-height');
          elements.membersList.style.removeProperty('height');
          elements.membersList.style.removeProperty('right');
        }
        break;

      case 5: // constants.I_USER_AREA
      // Element already floats
        break;

      case 6: // constants.I_CALL_WINDOW
      // Element already floats
        break;

      case 7: // constants.I_USER_PROFILE
        if (floating && settings.floatingPanels) {
          elements.userProfile.style.setProperty('position', 'absolute', 'important');
          elements.userProfile.style.setProperty('z-index', '190', 'important');
          elements.userProfile.style.setProperty('max-height', '100%', 'important');
          elements.userProfile.style.setProperty('height', '100%', 'important');
          elements.userProfile.style.setProperty('right', '0', 'important');
          elements.userProfile.style.setProperty('background', 'var(--background-secondary-alt)', 'important');
        }
        else {
          elements.userProfile.style.removeProperty('position');
          elements.userProfile.style.removeProperty('z-index');
          elements.userProfile.style.removeProperty('max-height');
          elements.userProfile.style.removeProperty('height');
          elements.userProfile.style.removeProperty('right');
          elements.userProfile.style.removeProperty('background');
        }
        break;

      default:
        break;
    }
  };

  // Returns a JSON object from a specified URL
  getJSON = async (url) => {
    const response = await fetch(url);
    return response.json();
  };

  // Returns the correct language strings for each locale
  getLabels = () => {
    switch (document.documentElement.getAttribute('lang')) {
      case 'da':
        runtime.localeLabels = {
          serverList: 'Serverliste',
          channelList: 'Kanalliste',
          membersList: 'Medlemsliste',
          userProfile: 'Brugerprofil',
          messageInput: 'Beskedindtastning',
          windowBar: 'Vinduestang',
          callWindow: 'Opkaldsvindue',
          userArea: 'Brugerområde',
        };
        break;

      case 'de':
        runtime.localeLabels = {
          serverList: 'Serverliste',
          channelList: 'Kanalliste',
          membersList: 'Mitgliederliste',
          userProfile: 'Benutzerprofil',
          messageInput: 'Nachrichteneingabe',
          windowBar: 'Fensterleiste',
          callWindow: 'Anruf-Fenster',
          userArea: 'Benutzerbereich',
        };
        break;

      case 'es-ES':
      case 'es-419':
        runtime.localeLabels = {
          serverList: 'Lista de Servidores',
          channelList: 'Lista de Canales',
          membersList: 'Lista de Miembros',
          userProfile: 'Perfil de Usuario',
          messageInput: 'Entrada de Mensajes',
          windowBar: 'Barra de Ventanas',
          callWindow: 'Ventana de Llamada',
          userArea: 'Área de Usuario',
        };
        break;

      case 'fr':
        runtime.localeLabels = {
          serverList: 'Liste des Serveurs',
          channelList: 'Liste des Canaux',
          membersList: 'Liste des Membres',
          userProfile: 'Profil Utilisateur',
          messageInput: 'Champ de Saisie',
          windowBar: 'Barre de Fenêtres',
          callWindow: 'Fenêtre d\'Appel',
          userArea: 'Espace Utilisateur',
        };
        break;

      case 'hr':
        runtime.localeLabels = {
          serverList: 'Popis Poslužitelja',
          channelList: 'Popis Kanala',
          membersList: 'Popis Članova',
          userProfile: 'Profil Korisnika',
          messageInput: 'Polje za Unos',
          windowBar: 'Traka za Prozore',
          callWindow: 'Prozor Poziva',
          userArea: 'Korisnički Prostor',
        };
        break;

      case 'it':
        runtime.localeLabels = {
          serverList: 'Lista dei Server',
          channelList: 'Lista dei Canali',
          membersList: 'Lista dei Membri',
          userProfile: 'Profilo Utente',
          messageInput: 'Campo di Inserimento',
          windowBar: 'Barra delle Finestre',
          callWindow: 'Finestra di Chiamata',
          userArea: 'Area Utente',
        };
        break;

      case 'lt':
        runtime.localeLabels = {
          serverList: 'Serverio Sąrašas',
          channelList: 'Kanalų Sąrašas',
          membersList: 'Narių Sąrašas',
          userProfile: 'Naudotojo Profilis',
          messageInput: 'Žinutės Įvedimas',
          windowBar: 'Lango Juosta',
          callWindow: 'Skambučio Langas',
          userArea: 'Naudotojo Erdvė',
        };
        break;

      case 'hu':
        runtime.localeLabels = {
          serverList: 'Kiszolgálólista',
          channelList: 'Csatornalista',
          membersList: 'Taglista',
          userProfile: 'Felhasználói Profil',
          messageInput: 'Üzenetbeviteli mező',
          windowBar: 'Ablaksor',
          callWindow: 'Hívásablak',
          userArea: 'Felhasználói Terület',
        };
        break;

      case 'nl':
        runtime.localeLabels = {
          serverList: 'Serverlijst',
          channelList: 'Kanaallijst',
          membersList: 'Ledenlijst',
          userProfile: 'Gebruikersprofiel',
          messageInput: 'Berichtinvoer',
          windowBar: 'Vensterbalk',
          callWindow: 'Oproepvenster',
          userArea: 'Gebruikersgebied',
        };
        break;

      case 'no':
        runtime.localeLabels = {
          serverList: 'Serverliste',
          channelList: 'Kanalliste',
          membersList: 'Medlemsliste',
          userProfile: 'Brukerprofil',
          messageInput: 'Beskjedinnføring',
          windowBar: 'Vindusbjelke',
          callWindow: 'Anropsvindu',
          userArea: 'Brukerområde',
        };
        break;

      case 'pl':
        runtime.localeLabels = {
          serverList: 'Lista Serwerów',
          channelList: 'Lista Kanałów',
          membersList: 'Lista Członków',
          userProfile: 'Profil Użytkownika',
          messageInput: 'Pole Wiadomości',
          windowBar: 'Pasek Okien',
          callWindow: 'Okno Połączeń',
          userArea: 'Obszar Użytkownika',
        };
        break;

      case 'pt-BR':
        runtime.localeLabels = {
          serverList: 'Lista de Servidores',
          channelList: 'Lista de Canais',
          membersList: 'Lista de Membros',
          userProfile: 'Perfil do Usuário',
          messageInput: 'Campo de Mensagens',
          windowBar: 'Barra de Janelas',
          callWindow: 'Janela de Chamada',
          userArea: 'Área do Usuário',
        };
        break;

      case 'ro':
        runtime.localeLabels = {
          serverList: 'Lista Serverelor',
          channelList: 'Lista Canalelor',
          membersList: 'Lista Membrilor',
          userProfile: 'Profilul Utilizatorului',
          messageInput: 'Câmp de Mesaj',
          windowBar: 'Bara Ferestrelor',
          callWindow: 'Fereastra De Apel',
          userArea: 'Zona Utilizatorului',
        };
        break;

      case 'fi':
        runtime.localeLabels = {
          serverList: 'Palvelinluettelo',
          channelList: 'Kanavaluettelo',
          membersList: 'Jäsenluettelo',
          userProfile: 'Käyttäjäprofiili',
          messageInput: 'Viestin Syöttö',
          windowBar: 'Ikkunapalkki',
          callWindow: 'Puhelinikkuna',
          userArea: 'Käyttäjäalue',
        };
        break;

      case 'sv-SE':
        runtime.localeLabels = {
          serverList: 'Serverlista',
          channelList: 'Kanallista',
          membersList: 'Medlemslista',
          userProfile: 'Användarprofil',
          messageInput: 'Meddelandeinmatning',
          windowBar: 'Fönsterfält',
          callWindow: 'Samtalsfönster',
          userArea: 'Användarområde',
        };
        break;

      case 'vi':
        runtime.localeLabels = {
          serverList: 'Danh Sách Máy Chủ',
          channelList: 'Danh Sách Kênh',
          membersList: 'Danh Sách Thành Viên',
          userProfile: 'Hồ Sơ Người Dùng',
          messageInput: 'Nhập Tin Nhắn',
          windowBar: 'Thanh Cửa Sổ',
          callWindow: 'Cửa Sổ Cuộc Gọi',
          userArea: 'Khu Vực Người Dùng',
        };
        break;

      case 'tr':
        runtime.localeLabels = {
          serverList: 'Sunucu Listesi',
          channelList: 'Kanal Listesi',
          membersList: 'Üye Listesi',
          userProfile: 'Kullanıcı Profili',
          messageInput: 'Mesaj Girişi',
          windowBar: 'Pencere Çubuğu',
          callWindow: 'Arama Penceresi',
          userArea: 'Kullanıcı Alanı',
        };
        break;

      case 'cs':
        runtime.localeLabels = {
          serverList: 'Seznam Serverů',
          channelList: 'Seznam Kanálů',
          membersList: 'Seznam Členů',
          userProfile: 'Uživatelský Profil',
          messageInput: 'Vstup Zprávy',
          windowBar: 'Pás Oken',
          callWindow: 'Okno Hovorů',
          userArea: 'Uživatelská Oblast',
        };
        break;

      case 'el':
        runtime.localeLabels = {
          serverList: 'Λίστα Διακομιστών',
          channelList: 'Λίστα Καναλιών',
          membersList: 'Λίστα Μελών',
          userProfile: 'Προφίλ Χρήστη',
          messageInput: 'Πεδίο Μηνύματος',
          windowBar: 'Γραμμή Παραθύρων',
          callWindow: 'Παράθυρο Κλήσης',
          userArea: 'Περιοχή Χρήστη',
        };
        break;

      case 'bg':
        runtime.localeLabels = {
          serverList: 'Списък на Сървърите',
          channelList: 'Списък на Каналите',
          membersList: 'Списък на Членовете',
          userProfile: 'Профил на Потребителя',
          messageInput: 'Полет за съобщения',
          windowBar: 'Лента на Прозорците',
          callWindow: 'Прозорец на Обаждането',
          userArea: 'Потребителска Област',
        };
        break;

      case 'ru':
        runtime.localeLabels = {
          serverList: 'Список Серверов',
          channelList: 'Список Каналов',
          membersList: 'Список Участников',
          userProfile: 'Профиль Пользователя',
          messageInput: 'Ввод Сообщений',
          windowBar: 'Панель Окон',
          callWindow: 'Окно Вызова',
          userArea: 'Область Пользователя',
        };
        break;

      case 'uk':
        runtime.localeLabels = {
          serverList: 'Список Сервера',
          channelList: 'Список Каналів',
          membersList: 'Список Учасників',
          userProfile: 'Профіль Користувача',
          messageInput: 'Введення Повідомлень',
          windowBar: 'Панель Вікон',
          callWindow: 'Вікно Виклику',
          userArea: 'Область Користувача',
        };
        break;

      case 'hi':
        runtime.localeLabels = {
          serverList: 'सर्वर सूची',
          channelList: 'चैनल सूची',
          membersList: 'सदस्य सूची',
          userProfile: 'उपयोगकर्ता प्रोफ़ाइल',
          messageInput: 'संदेश प्रविष्टि',
          windowBar: 'विंडो बार',
          callWindow: 'कॉल विंडो',
          userArea: 'उपयोगकर्ता क्षेत्र',
        };
        break;

      case 'th':
        runtime.localeLabels = {
          serverList: 'รายชื่อเซิร์ฟเวอร์',
          channelList: 'รายชื่อช่อง',
          membersList: 'รายชื่อสมาชิก',
          userProfile: 'โปรไฟล์ผู้ใช้',
          messageInput: 'การป้อนข้อความ',
          windowBar: 'แถบหน้าต่าง',
          callWindow: 'หน้าต่างการโทร',
          userArea: 'พื้นที่ผู้ใช้',
        };
        break;

      case 'zh-CN':
        runtime.localeLabels = {
          serverList: '服务器列表',
          channelList: '频道列表',
          membersList: '成员列表',
          userProfile: '用户资料',
          messageInput: '消息输入',
          windowBar: '窗口栏',
          callWindow: '通话窗口',
          userArea: '用户区域',
        };
        break;

      case 'ja':
        runtime.localeLabels = {
          serverList: 'サーバーリスト',
          channelList: 'チャンネルリスト',
          membersList: 'メンバーリスト',
          userProfile: 'ユーザープロフィール',
          messageInput: 'メッセージ入力',
          windowBar: 'ウィンドウバー',
          callWindow: '通話ウィンドウ',
          userArea: 'ユーザーエリア',
        };
        break;

      case 'zh-TW':
        runtime.localeLabels = {
          serverList: '伺服器列表',
          channelList: '頻道列表',
          membersList: '成員列表',
          userProfile: '用戶資料',
          messageInput: '消息輸入',
          windowBar: '視窗欄',
          callWindow: '通話視窗',
          userArea: '用戶區域',
        };
        break;

      case 'ko':
        runtime.localeLabels = {
          serverList: '서버 목록',
          channelList: '채널 목록',
          membersList: '회원 목록',
          userProfile: '사용자 프로필',
          messageInput: '메시지 입력',
          windowBar: '윈도우 바',
          callWindow: '통화 창',
          userArea: '사용자 영역',
        };
        break;

      default:
        runtime.localeLabels = {
          serverList: 'Server List',
          channelList: 'Channel List',
          membersList: 'Members List',
          userProfile: 'User Profile',
          messageInput: 'Message Input',
          windowBar: 'Window Bar',
          callWindow: 'Call Window',
          userArea: 'User Area',
        };
    }
  };

  // Kicks off various mutationObservers to improve plugin presence
  initObservers = () => {
    var _this = this; // Abstract CollapsibleUI as a variable

    // Add mutation observer to reload when user closes settings page
    runtime.observers.settings = new MutationObserver((mutationList) => {
      try {
        if (mutationList[0].target.ariaHidden === 'false') {
          _this.initialize();
          return;
        }
      }
      catch (e) {
        console.warn('%c[CollapsibleUI] ' + '%cFailed to trigger mutationObserver reload! (see below)',
          'color: #3a71c1; font-weight: 700;', '');
        console.warn(e);
      }
    });
    runtime.observers.settings.observe(elements.baseLayer, { attributeFilter: ['aria-hidden'] });

    // Add mutation observer to reload my plugin when necessary
    runtime.observers.app = new MutationObserver((mutationList) => {
      try {
        // If there are a lot of mutations, assume we need to reload
        // This increases performance a lot when switching views
        // In some cases, this can trigger several times in a row
        // This is intentional, as it maintains the user's preferences throughout transitions
        // This in turn prevents collapsed elements from "jumping" while the plugin reloads
        if (mutationList.length > constants.MAX_ITER_MUTATIONS) {
          // Prevent UI jumping when user presses Shift or unimportant data is reloaded
          if ((!mutationList[0].target.classList.contains(modules.buttons?.wrapper))
            && (!mutationList[0].target.classList.contains(modules.ephemeral?.content)))
            _this.initialize();
          return;
        }

        // Checks for a variety of small mutations and reloads if necessary
        // This is required for BDFDB compatibility
        for (var i = 0; i < mutationList.length; i++) {
          if (mutationList[i].addedNodes[0]?.classList?.contains(modules.app?.app)
            || mutationList[i].addedNodes[0]?.classList?.contains(modules.app?.layers)
            || mutationList[i].addedNodes[0]?.classList?.contains(modules.sidebar?.sidebar)
            || mutationList[i].addedNodes[0]?.classList?.contains(modules.servers?.wrapper)
            || mutationList[i].addedNodes[0]?.classList?.contains(modules.members?.membersWrap)
            || mutationList[i].addedNodes[0]?.classList?.contains(modules.members?.container)
            || mutationList[i].addedNodes[0]?.classList?.contains(modules.panel?.inner)
            || mutationList[i].addedNodes[0]?.classList?.contains(modules.panel?.outer)
            || mutationList[i].addedNodes[0]?.classList?.contains(modules.callContainer?.wrapper)
            || mutationList[i].addedNodes[0]?.classList?.contains(modules.members?.members)
            || mutationList[i].addedNodes[0]?.classList?.contains(modules.threads?.container)
            || mutationList[i].addedNodes[0]?.classList?.contains(modules.banner?.mask)
            || mutationList[i].addedNodes[0]?.classList?.contains(modules.search?.searchResultsWrap)
            || mutationList[i].addedNodes[0]?.classList?.contains(modules.floating?.chatLayerWrapper)
            || mutationList[i].removedNodes[0]?.classList?.contains(modules.callContainer?.wrapper)) {
            _this.initialize();
            return;
          }
        }

        // If mutations are noncritical, just update autocollapse conditionals
        if (settings.expandOnHover)
          _this.applyCollapseConditionals();

        // Update DM badge
        if (settings.unreadDMsBadge)
          this.updateDMBadge();
        else
          this.updateDMBadge(true);
      }
      catch (e) {
        console.warn('%c[CollapsibleUI] ' + '%cFailed to trigger mutationObserver reload! (see below)',
          'color: #3a71c1; font-weight: 700;', '');
        console.warn(e);
      }
    });
    runtime.observers.app.observe(elements.outerAppWrapper, {
      childList: true,
      subtree: true,
      attributes: false,
    });
  };

  // Initializes all global plugin settings
  initSettings = () => {
    // Make sure settings version is set
    if (!runtime.api.Data.load('settings-version'))
      runtime.api.Data.save('settings-version', '0');

    // Clean up old settings
    if (parseInt(runtime.api.Data.load('settings-version')) < 14) {
      // Clean up (v14)
      runtime.api.Data.delete('cuiSettingsVersion');
      runtime.api.Data.delete('disableTransitions');
      runtime.api.Data.delete('transitionSpeed');
      runtime.api.Data.delete('disableToolbarCollapse');
      runtime.api.Data.delete('disableSettingsCollapse');
      runtime.api.Data.delete('enableFullToolbarCollapse');
      runtime.api.Data.delete('dynamicUncollapse');
      runtime.api.Data.delete('dynamicUncollapseDelay');
      runtime.api.Data.delete('resizableChannelList');
      runtime.api.Data.delete('channelListWidth');
      runtime.api.Data.delete('disabledButtonsStayCollapsed');
      runtime.api.Data.delete('settingsButtonsMaxWidth');
      runtime.api.Data.delete('toolbarIconMaxWidth');
      runtime.api.Data.delete('toolbarMaxWidth');
      runtime.api.Data.delete('userAreaMaxHeight');
      runtime.api.Data.delete('msgBarMaxHeight');
      runtime.api.Data.delete('windowBarHeight');
      runtime.api.Data.delete('collapsedDistance');
      runtime.api.Data.delete('autoCollapse');
      runtime.api.Data.delete('keyBindsEnabled');
      runtime.api.Data.delete('serverListButtonActive');
      runtime.api.Data.delete('channelListButtonActive');
      runtime.api.Data.delete('msgBarButtonActive');
      runtime.api.Data.delete('windowBarButtonActive');
      runtime.api.Data.delete('membersListButtonActive');
      runtime.api.Data.delete('userAreaButtonActive');
      runtime.api.Data.delete('callContainerButtonActive');
      runtime.api.Data.delete('conditionalAutoCollapse');
      runtime.api.Data.delete('dynamicUncollapseDistance');
      runtime.api.Data.delete('dynamicUncollapseCloseDistance');
      runtime.api.Data.delete('autoCollapseThreshold');
      runtime.api.Data.delete('autoCollapseConditionals');
      runtime.api.Data.delete('buttonsOrder');
      runtime.api.Data.delete('dynamicUncollapseEnabled');
      runtime.api.Data.delete('keyStringList');
      runtime.api.Data.delete('disableMsgBarBtnCollapse');
      runtime.api.Data.delete('messageBarButtonsMinWidth');
      runtime.api.Data.delete('buttonCollapseFudgeFactor');
      runtime.api.Data.delete('resizableMembersList');
      runtime.api.Data.delete('floatingDynamicUncollapse');
      runtime.api.Data.delete('resizableUserProfile');
      runtime.api.Data.delete('membersListWidth');
      runtime.api.Data.delete('profilePanelWidth');
      runtime.api.Data.delete('persistentUnreadBadge');
      runtime.api.Data.delete('profilePanelButtonActive');
      runtime.api.Data.delete('messageBarButtonsMaxWidth');
    }

    if (parseInt(runtime.api.Data.load('settings-version')) < 15) {
      // Clean up (v15)
      runtime.api.Data.delete('server-list-button-active');
      runtime.api.Data.delete('channel-list-button-active');
      runtime.api.Data.delete('message-input-button-active');
      runtime.api.Data.delete('window-bar-button-active');
      runtime.api.Data.delete('user-profile-button-active');
      runtime.api.Data.delete('user-area-button-active');
      runtime.api.Data.delete('members-list-button-active');
      runtime.api.Data.delete('call-window-button-active');

      // Set new settings version
      runtime.api.Data.save('settings-version', '15');
    }

    if (runtime.api.Data.load('transition-speed') !== undefined) {
      settings.transitionSpeed = runtime.api.Data.load('transition-speed');
      config.settings[0].settings[0].value = settings.transitionSpeed;
    }
    else runtime.api.Data.save('transition-speed', settings.transitionSpeed);
    if (runtime.api.Data.load('collapse-toolbar') !== undefined) {
      settings.collapseToolbar = runtime.api.Data.load('collapse-toolbar');
      config.settings[0].settings[1].value = settings.collapseToolbar;
    }
    else runtime.api.Data.save('collapse-toolbar', settings.collapseToolbar);
    if (runtime.api.Data.load('collapse-settings') !== undefined) {
      settings.collapseSettings = runtime.api.Data.load('collapse-settings');
      config.settings[0].settings[2].value = settings.collapseSettings;
    }
    else runtime.api.Data.save('collapse-settings', settings.collapseSettings);
    if (runtime.api.Data.load('message-input-collapse') !== undefined) {
      settings.messageInputCollapse = runtime.api.Data.load('message-input-collapse');
      config.settings[0].settings[3].value = settings.messageInputCollapse;
    }
    else runtime.api.Data.save('message-input-collapse', settings.messageInputCollapse);
    if (runtime.api.Data.load('resizable-channel-list') !== undefined) {
      settings.resizableChannelList = runtime.api.Data.load('resizable-channel-list');
      config.settings[0].settings[4].value = settings.resizableChannelList;
    }
    else runtime.api.Data.save('resizable-channel-list', settings.resizableChannelList);
    if (runtime.api.Data.load('resizable-members-list') !== undefined) {
      settings.resizableMembersList = runtime.api.Data.load('resizable-members-list');
      config.settings[0].settings[5].value = settings.resizableMembersList;
    }
    else runtime.api.Data.save('resizable-members-list', settings.resizableMembersList);
    if (runtime.api.Data.load('resizable-user-profile') !== undefined) {
      settings.resizableUserProfile = runtime.api.Data.load('resizable-user-profile');
      config.settings[0].settings[6].value = settings.resizableUserProfile;
    }
    else runtime.api.Data.save('resizable-user-profile', settings.resizableUserProfile);
    if (runtime.api.Data.load('resizable-search-panel') !== undefined) {
      settings.resizableSearchPanel = runtime.api.Data.load('resizable-search-panel');
      config.settings[0].settings[7].value = settings.resizableSearchPanel;
    }
    else runtime.api.Data.save('resizable-search-panel', settings.resizableSearchPanel);
    if (runtime.api.Data.load('resizable-forum-popout') !== undefined) {
      settings.resizableForumPopout = runtime.api.Data.load('resizable-forum-popout');
      config.settings[0].settings[8].value = settings.resizableForumPopout;
    }
    else runtime.api.Data.save('resizable-forum-popout', settings.resizableForumPopout);
    if (runtime.api.Data.load('unread-dms-badge') !== undefined) {
      settings.unreadDMsBadge = runtime.api.Data.load('unread-dms-badge');
      config.settings[0].settings[9].value = settings.unreadDMsBadge;
    }
    else runtime.api.Data.save('unread-dms-badge', settings.unreadDMsBadge);

    if (runtime.api.Data.load('keyboard-shortcuts') !== undefined) {
      settings.keyboardShortcuts = runtime.api.Data.load('keyboard-shortcuts');
      config.settings[1].settings[0].value = settings.keyboardShortcuts;
    }
    else runtime.api.Data.save('keyboard-shortcuts', settings.keyboardShortcuts);
    if (runtime.api.Data.load('server-list-shortcut') !== undefined) {
      settings.shortcutList[constants.I_SERVER_LIST] = runtime.api.Data.load('server-list-shortcut');
      config.settings[1].settings[1].value = settings.shortcutList[constants.I_SERVER_LIST];
    }
    else runtime.api.Data.save('server-list-shortcut', settings.shortcutList[constants.I_SERVER_LIST]);
    if (runtime.api.Data.load('channel-list-shortcut') !== undefined) {
      settings.shortcutList[constants.I_CHANNEL_LIST] = runtime.api.Data.load('channel-list-shortcut');
      config.settings[1].settings[2].value = settings.shortcutList[constants.I_CHANNEL_LIST];
    }
    else runtime.api.Data.save('channel-list-shortcut', settings.shortcutList[constants.I_CHANNEL_LIST]);
    if (runtime.api.Data.load('members-list-shortcut') !== undefined) {
      settings.shortcutList[constants.I_MEMBERS_LIST] = runtime.api.Data.load('members-list-shortcut');
      config.settings[1].settings[3].value = settings.shortcutList[constants.I_MEMBERS_LIST];
    }
    else runtime.api.Data.save('members-list-shortcut', settings.shortcutList[constants.I_MEMBERS_LIST]);
    if (runtime.api.Data.load('user-profile-shortcut') !== undefined) {
      settings.shortcutList[constants.I_USER_PROFILE] = runtime.api.Data.load('user-profile-shortcut');
      config.settings[1].settings[4].value = settings.shortcutList[constants.I_USER_PROFILE];
    }
    else runtime.api.Data.save('user-profile-shortcut', settings.shortcutList[constants.I_USER_PROFILE]);
    if (runtime.api.Data.load('message-input-shortcut') !== undefined) {
      settings.shortcutList[constants.I_MESSAGE_INPUT] = runtime.api.Data.load('message-input-shortcut');
      config.settings[1].settings[5].value = settings.shortcutList[constants.I_MESSAGE_INPUT];
    }
    else runtime.api.Data.save('message-input-shortcut', settings.shortcutList[constants.I_MESSAGE_INPUT]);
    if (runtime.api.Data.load('window-bar-shortcut') !== undefined) {
      settings.shortcutList[constants.I_WINDOW_BAR] = runtime.api.Data.load('window-bar-shortcut');
      config.settings[1].settings[6].value = settings.shortcutList[constants.I_WINDOW_BAR];
    }
    else runtime.api.Data.save('window-bar-shortcut', settings.shortcutList[constants.I_WINDOW_BAR]);
    if (runtime.api.Data.load('call-window-shortcut') !== undefined) {
      settings.shortcutList[constants.I_CALL_WINDOW] = runtime.api.Data.load('call-window-shortcut');
      config.settings[1].settings[7].value = settings.shortcutList[constants.I_CALL_WINDOW];
    }
    else runtime.api.Data.save('call-window-shortcut', settings.shortcutList[constants.I_CALL_WINDOW]);
    if (runtime.api.Data.load('user-area-shortcut') !== undefined) {
      settings.shortcutList[constants.I_USER_AREA] = runtime.api.Data.load('user-area-shortcut');
      config.settings[1].settings[8].value = settings.shortcutList[constants.I_USER_AREA];
    }
    else runtime.api.Data.save('user-area-shortcut', settings.shortcutList[constants.I_USER_AREA]);

    if (runtime.api.Data.load('collapse-disabled-buttons') !== undefined) {
      settings.collapseDisabledButtons = runtime.api.Data.load('collapse-disabled-buttons');
      config.settings[2].settings[0].value = settings.collapseDisabledButtons;
    }
    else runtime.api.Data.save('collapse-disabled-buttons', settings.collapseDisabledButtons);
    if (runtime.api.Data.load('server-list-button-index') !== undefined) {
      settings.buttonIndexes[constants.I_SERVER_LIST] = runtime.api.Data.load('server-list-button-index');
      config.settings[2].settings[1].value = settings.buttonIndexes[constants.I_SERVER_LIST];
    }
    else runtime.api.Data.save('server-list-button-index', settings.buttonIndexes[constants.I_SERVER_LIST]);
    if (runtime.api.Data.load('channel-list-button-index') !== undefined) {
      settings.buttonIndexes[constants.I_CHANNEL_LIST] = runtime.api.Data.load('channel-list-button-index');
      config.settings[2].settings[2].value = settings.buttonIndexes[constants.I_CHANNEL_LIST];
    }
    else runtime.api.Data.save('channel-list-button-index', settings.buttonIndexes[constants.I_CHANNEL_LIST]);
    if (runtime.api.Data.load('members-list-button-index') !== undefined) {
      settings.buttonIndexes[constants.I_MEMBERS_LIST] = runtime.api.Data.load('members-list-button-index');
      config.settings[2].settings[3].value = settings.buttonIndexes[constants.I_MEMBERS_LIST];
    }
    else runtime.api.Data.save('members-list-button-index', settings.buttonIndexes[constants.I_MEMBERS_LIST]);
    if (runtime.api.Data.load('user-profile-button-index') !== undefined) {
      settings.buttonIndexes[constants.I_USER_PROFILE] = runtime.api.Data.load('user-profile-button-index');
      config.settings[2].settings[4].value = settings.buttonIndexes[constants.I_USER_PROFILE];
    }
    else runtime.api.Data.save('user-profile-button-index', settings.buttonIndexes[constants.I_USER_PROFILE]);
    if (runtime.api.Data.load('message-input-button-index') !== undefined) {
      settings.buttonIndexes[constants.I_MESSAGE_INPUT] = runtime.api.Data.load('message-input-button-index');
      config.settings[2].settings[5].value = settings.buttonIndexes[constants.I_MESSAGE_INPUT];
    }
    else runtime.api.Data.save('message-input-button-index', settings.buttonIndexes[constants.I_MESSAGE_INPUT]);
    if (runtime.api.Data.load('window-bar-button-index') !== undefined) {
      settings.buttonIndexes[constants.I_WINDOW_BAR] = runtime.api.Data.load('window-bar-button-index');
      config.settings[2].settings[6].value = settings.buttonIndexes[constants.I_WINDOW_BAR];
    }
    else runtime.api.Data.save('window-bar-button-index', settings.buttonIndexes[constants.I_WINDOW_BAR]);
    if (runtime.api.Data.load('call-window-button-index') !== undefined) {
      settings.buttonIndexes[constants.I_CALL_WINDOW] = runtime.api.Data.load('call-window-button-index');
      config.settings[2].settings[7].value = settings.buttonIndexes[constants.I_CALL_WINDOW];
    }
    else runtime.api.Data.save('call-window-button-index', settings.buttonIndexes[constants.I_CALL_WINDOW]);
    if (runtime.api.Data.load('user-area-button-index') !== undefined) {
      settings.buttonIndexes[constants.I_USER_AREA] = runtime.api.Data.load('user-area-button-index');
      config.settings[2].settings[8].value = settings.buttonIndexes[constants.I_USER_AREA];
    }
    else runtime.api.Data.save('user-area-button-index', settings.buttonIndexes[constants.I_USER_AREA]);

    if (runtime.api.Data.load('expand-on-hover') !== undefined) {
      settings.expandOnHover = runtime.api.Data.load('expand-on-hover');
      config.settings[3].settings[0].value = settings.expandOnHover;
    }
    else runtime.api.Data.save('expand-on-hover', settings.expandOnHover);
    if (runtime.api.Data.load('floating-panels') !== undefined) {
      settings.floatingPanels = runtime.api.Data.load('floating-panels');
      config.settings[3].settings[1].value = settings.floatingPanels;
    }
    else runtime.api.Data.save('floating-panels', settings.floatingPanels);
    if (runtime.api.Data.load('server-list-expand-on-hover') !== undefined) {
      settings.expandOnHoverEnabled[constants.I_SERVER_LIST] = runtime.api.Data.load('server-list-expand-on-hover');
      config.settings[3].settings[2].value = settings.expandOnHoverEnabled[constants.I_SERVER_LIST];
    }
    else runtime.api.Data.save('server-list-expand-on-hover', settings.expandOnHoverEnabled[constants.I_SERVER_LIST]);
    if (runtime.api.Data.load('channel-list-expand-on-hover') !== undefined) {
      settings.expandOnHoverEnabled[constants.I_CHANNEL_LIST] = runtime.api.Data.load('channel-list-expand-on-hover');
      config.settings[3].settings[3].value = settings.expandOnHoverEnabled[constants.I_CHANNEL_LIST];
    }
    else runtime.api.Data.save('channel-list-expand-on-hover', settings.expandOnHoverEnabled[constants.I_CHANNEL_LIST]);
    if (runtime.api.Data.load('members-list-expand-on-hover') !== undefined) {
      settings.expandOnHoverEnabled[constants.I_MEMBERS_LIST] = runtime.api.Data.load('members-list-expand-on-hover');
      config.settings[3].settings[4].value = settings.expandOnHoverEnabled[constants.I_MEMBERS_LIST];
    }
    else runtime.api.Data.save('members-list-expand-on-hover', settings.expandOnHoverEnabled[constants.I_MEMBERS_LIST]);
    if (runtime.api.Data.load('user-profile-expand-on-hover') !== undefined) {
      settings.expandOnHoverEnabled[constants.I_USER_PROFILE] = runtime.api.Data.load('user-profile-expand-on-hover');
      config.settings[3].settings[5].value = settings.expandOnHoverEnabled[constants.I_USER_PROFILE];
    }
    else runtime.api.Data.save('user-profile-expand-on-hover', settings.expandOnHoverEnabled[constants.I_USER_PROFILE]);
    if (runtime.api.Data.load('message-input-expand-on-hover') !== undefined) {
      settings.expandOnHoverEnabled[constants.I_MESSAGE_INPUT] = runtime.api.Data.load('message-input-expand-on-hover');
      config.settings[3].settings[6].value = settings.expandOnHoverEnabled[constants.I_MESSAGE_INPUT];
    }
    else runtime.api.Data.save('message-input-expand-on-hover', settings.expandOnHoverEnabled[constants.I_MESSAGE_INPUT]);
    if (runtime.api.Data.load('window-bar-expand-on-hover') !== undefined) {
      settings.expandOnHoverEnabled[constants.I_WINDOW_BAR] = runtime.api.Data.load('window-bar-expand-on-hover');
      config.settings[3].settings[7].value = settings.expandOnHoverEnabled[constants.I_WINDOW_BAR];
    }
    else runtime.api.Data.save('window-bar-expand-on-hover', settings.expandOnHoverEnabled[constants.I_WINDOW_BAR]);
    if (runtime.api.Data.load('call-window-expand-on-hover') !== undefined) {
      settings.expandOnHoverEnabled[constants.I_CALL_WINDOW] = runtime.api.Data.load('call-window-expand-on-hover');
      config.settings[3].settings[8].value = settings.expandOnHoverEnabled[constants.I_CALL_WINDOW];
    }
    else runtime.api.Data.save('call-window-expand-on-hover', settings.expandOnHoverEnabled[constants.I_CALL_WINDOW]);
    if (runtime.api.Data.load('user-area-expand-on-hover') !== undefined) {
      settings.expandOnHoverEnabled[constants.I_USER_AREA] = runtime.api.Data.load('user-area-expand-on-hover');
      config.settings[3].settings[9].value = settings.expandOnHoverEnabled[constants.I_USER_AREA];
    }
    else runtime.api.Data.save('user-area-expand-on-hover', settings.expandOnHoverEnabled[constants.I_USER_AREA]);

    if (runtime.api.Data.load('size-collapse') !== undefined) {
      settings.sizeCollapse = runtime.api.Data.load('size-collapse');
      config.settings[4].settings[0].value = settings.sizeCollapse;
    }
    else runtime.api.Data.save('size-collapse', settings.sizeCollapse);
    if (runtime.api.Data.load('server-list-threshold') !== undefined) {
      settings.sizeCollapseThreshold[constants.I_SERVER_LIST] = runtime.api.Data.load('server-list-threshold');
      config.settings[4].settings[1].value = settings.sizeCollapseThreshold[constants.I_SERVER_LIST];
    }
    else runtime.api.Data.save('server-list-threshold', settings.sizeCollapseThreshold[constants.I_SERVER_LIST]);
    if (runtime.api.Data.load('channel-list-threshold') !== undefined) {
      settings.sizeCollapseThreshold[constants.I_CHANNEL_LIST] = runtime.api.Data.load('channel-list-threshold');
      config.settings[4].settings[2].value = settings.sizeCollapseThreshold[constants.I_CHANNEL_LIST];
    }
    else runtime.api.Data.save('channel-list-threshold', settings.sizeCollapseThreshold[constants.I_CHANNEL_LIST]);
    if (runtime.api.Data.load('members-list-threshold') !== undefined) {
      settings.sizeCollapseThreshold[constants.I_MEMBERS_LIST] = runtime.api.Data.load('members-list-threshold');
      config.settings[4].settings[3].value = settings.sizeCollapseThreshold[constants.I_MEMBERS_LIST];
    }
    else runtime.api.Data.save('members-list-threshold', settings.sizeCollapseThreshold[constants.I_MEMBERS_LIST]);
    if (runtime.api.Data.load('user-profile-threshold') !== undefined) {
      settings.sizeCollapseThreshold[constants.I_USER_PROFILE] = runtime.api.Data.load('user-profile-threshold');
      config.settings[4].settings[4].value = settings.sizeCollapseThreshold[constants.I_USER_PROFILE];
    }
    else runtime.api.Data.save('user-profile-threshold', settings.sizeCollapseThreshold[constants.I_USER_PROFILE]);
    if (runtime.api.Data.load('message-input-threshold') !== undefined) {
      settings.sizeCollapseThreshold[constants.I_MESSAGE_INPUT] = runtime.api.Data.load('message-input-threshold');
      config.settings[4].settings[5].value = settings.sizeCollapseThreshold[constants.I_MESSAGE_INPUT];
    }
    else runtime.api.Data.save('message-input-threshold', settings.sizeCollapseThreshold[constants.I_MESSAGE_INPUT]);
    if (runtime.api.Data.load('window-bar-threshold') !== undefined) {
      settings.sizeCollapseThreshold[constants.I_WINDOW_BAR] = runtime.api.Data.load('window-bar-threshold');
      config.settings[4].settings[6].value = settings.sizeCollapseThreshold[constants.I_WINDOW_BAR];
    }
    else runtime.api.Data.save('window-bar-threshold', settings.sizeCollapseThreshold[constants.I_WINDOW_BAR]);
    if (runtime.api.Data.load('call-window-threshold') !== undefined) {
      settings.sizeCollapseThreshold[constants.I_CALL_WINDOW] = runtime.api.Data.load('call-window-threshold');
      config.settings[4].settings[7].value = settings.sizeCollapseThreshold[constants.I_CALL_WINDOW];
    }
    else runtime.api.Data.save('call-window-threshold', settings.sizeCollapseThreshold[constants.I_CALL_WINDOW]);
    if (runtime.api.Data.load('user-area-threshold') !== undefined) {
      settings.sizeCollapseThreshold[constants.I_USER_AREA] = runtime.api.Data.load('user-area-threshold');
      config.settings[4].settings[8].value = settings.sizeCollapseThreshold[constants.I_USER_AREA];
    }
    else runtime.api.Data.save('user-area-threshold', settings.sizeCollapseThreshold[constants.I_USER_AREA]);

    if (runtime.api.Data.load('conditional-collapse') !== undefined) {
      settings.conditionalCollapse = runtime.api.Data.load('conditional-collapse');
      config.settings[5].settings[0].value = settings.conditionalCollapse;
    }
    else runtime.api.Data.save('conditional-collapse', settings.conditionalCollapse);
    if (runtime.api.Data.load('server-list-conditional') !== undefined) {
      settings.collapseConditionals[constants.I_SERVER_LIST] = runtime.api.Data.load('server-list-conditional');
      config.settings[5].settings[1].value = settings.collapseConditionals[constants.I_SERVER_LIST];
    }
    else runtime.api.Data.save('server-list-conditional', settings.collapseConditionals[constants.I_SERVER_LIST]);
    if (runtime.api.Data.load('channel-list-conditional') !== undefined) {
      settings.collapseConditionals[constants.I_CHANNEL_LIST] = runtime.api.Data.load('channel-list-conditional');
      config.settings[5].settings[2].value = settings.collapseConditionals[constants.I_CHANNEL_LIST];
    }
    else runtime.api.Data.save('channel-list-conditional', settings.collapseConditionals[constants.I_CHANNEL_LIST]);
    if (runtime.api.Data.load('members-list-conditional') !== undefined) {
      settings.collapseConditionals[constants.I_MEMBERS_LIST] = runtime.api.Data.load('members-list-conditional');
      config.settings[5].settings[3].value = settings.collapseConditionals[constants.I_MEMBERS_LIST];
    }
    else runtime.api.Data.save('members-list-conditional', settings.collapseConditionals[constants.I_MEMBERS_LIST]);
    if (runtime.api.Data.load('user-profile-conditional') !== undefined) {
      settings.collapseConditionals[constants.I_USER_PROFILE] = runtime.api.Data.load('user-profile-conditional');
      config.settings[5].settings[4].value = settings.collapseConditionals[constants.I_USER_PROFILE];
    }
    else runtime.api.Data.save('user-profile-conditional', settings.collapseConditionals[constants.I_USER_PROFILE]);
    if (runtime.api.Data.load('message-input-conditional') !== undefined) {
      settings.collapseConditionals[constants.I_MESSAGE_INPUT] = runtime.api.Data.load('message-input-conditional');
      config.settings[5].settings[5].value = settings.collapseConditionals[constants.I_MESSAGE_INPUT];
    }
    else runtime.api.Data.save('message-input-conditional', settings.collapseConditionals[constants.I_MESSAGE_INPUT]);
    if (runtime.api.Data.load('window-bar-conditional') !== undefined) {
      settings.collapseConditionals[constants.I_WINDOW_BAR] = runtime.api.Data.load('window-bar-conditional');
      config.settings[5].settings[6].value = settings.collapseConditionals[constants.I_WINDOW_BAR];
    }
    else runtime.api.Data.save('window-bar-conditional', settings.collapseConditionals[constants.I_WINDOW_BAR]);
    if (runtime.api.Data.load('call-window-conditional') !== undefined) {
      settings.collapseConditionals[constants.I_CALL_WINDOW] = runtime.api.Data.load('call-window-conditional');
      config.settings[5].settings[7].value = settings.collapseConditionals[constants.I_CALL_WINDOW];
    }
    else runtime.api.Data.save('call-window-conditional', settings.collapseConditionals[constants.I_CALL_WINDOW]);
    if (runtime.api.Data.load('user-area-conditional') !== undefined) {
      settings.collapseConditionals[constants.I_USER_AREA] = runtime.api.Data.load('user-area-conditional');
      config.settings[5].settings[8].value = settings.collapseConditionals[constants.I_USER_AREA];
    }
    else runtime.api.Data.save('user-area-conditional', settings.collapseConditionals[constants.I_USER_AREA]);

    if (runtime.api.Data.load('collapse-size') !== undefined) {
      settings.collapseSize = runtime.api.Data.load('collapse-size');
      config.settings[6].settings[0].value = settings.collapseSize;
    }
    else runtime.api.Data.save('collapse-size', settings.collapseSize);
    if (runtime.api.Data.load('button-collapse-fudge-factor') !== undefined) {
      settings.buttonCollapseFudgeFactor = runtime.api.Data.load('button-collapse-fudge-factor');
      config.settings[6].settings[1].value = settings.buttonCollapseFudgeFactor;
    }
    else runtime.api.Data.save('button-collapse-fudge-factor', settings.buttonCollapseFudgeFactor);
    if (runtime.api.Data.load('expand-on-hover-delay') !== undefined) {
      settings.expandOnHoverDelay = runtime.api.Data.load('expand-on-hover-delay');
      config.settings[6].settings[2].value = settings.expandOnHoverDelay;
    }
    else runtime.api.Data.save('expand-on-hover-delay', settings.expandOnHoverDelay);
    if (runtime.api.Data.load('expand-on-hover-opening-fudge-factor') !== undefined) {
      settings.expandOnHoverOpeningFudgeFactor = runtime.api.Data.load('expand-on-hover-opening-fudge-factor');
      config.settings[6].settings[3].value = settings.expandOnHoverOpeningFudgeFactor;
    }
    else runtime.api.Data.save('expand-on-hover-opening-fudge-factor', settings.expandOnHoverOpeningFudgeFactor);
    if (runtime.api.Data.load('expand-on-hover-closing-fudge-factor') !== undefined) {
      settings.expandOnHoverClosingFudgeFactor = runtime.api.Data.load('expand-on-hover-closing-fudge-factor');
      config.settings[6].settings[4].value = settings.expandOnHoverClosingFudgeFactor;
    }
    else runtime.api.Data.save('expand-on-hover-closing-fudge-factor', settings.expandOnHoverClosingFudgeFactor);
    if (runtime.api.Data.load('settings-buttons-max-width') !== undefined) {
      settings.settingsButtonsMaxWidth = runtime.api.Data.load('settings-buttons-max-width');
      config.settings[6].settings[5].value = settings.settingsButtonsMaxWidth;
    }
    else runtime.api.Data.save('settings-buttons-max-width', settings.settingsButtonsMaxWidth);
    if (runtime.api.Data.load('message-input-buttons-max-width') !== undefined) {
      settings.messageInputButtonsMaxWidth = runtime.api.Data.load('message-input-buttons-max-width');
      config.settings[6].settings[6].value = settings.messageInputButtonsMaxWidth;
    }
    else runtime.api.Data.save('message-input-buttons-max-width', settings.messageInputButtonsMaxWidth);
    if (runtime.api.Data.load('message-input-buttons-collapsed-width') !== undefined) {
      settings.messageInputButtonsCollapsedWidth = runtime.api.Data.load('message-input-buttons-collapsed-width');
      config.settings[6].settings[7].value = settings.messageInputButtonsCollapsedWidth;
    }
    else runtime.api.Data.save('message-input-buttons-collapsed-width', settings.messageInputButtonsCollapsedWidth);
    if (runtime.api.Data.load('toolbar-buttons-max-width') !== undefined) {
      settings.toolbarButtonsMaxWidth = runtime.api.Data.load('toolbar-buttons-max-width');
      config.settings[6].settings[8].value = settings.toolbarButtonsMaxWidth;
    }
    else runtime.api.Data.save('toolbar-buttons-max-width', settings.toolbarButtonsMaxWidth);
    if (runtime.api.Data.load('toolbar-max-width') !== undefined) {
      settings.toolbarMaxWidth = runtime.api.Data.load('toolbar-max-width');
      config.settings[6].settings[9].value = settings.toolbarMaxWidth;
    }
    else runtime.api.Data.save('toolbar-max-width', settings.toolbarMaxWidth);
    if (runtime.api.Data.load('user-area-max-height') !== undefined) {
      settings.userAreaMaxHeight = runtime.api.Data.load('user-area-max-height');
      config.settings[6].settings[10].value = settings.userAreaMaxHeight;
    }
    else runtime.api.Data.save('user-area-max-height', settings.userAreaMaxHeight);
    if (runtime.api.Data.load('message-input-max-height') !== undefined) {
      settings.messageInputMaxHeight = runtime.api.Data.load('message-input-max-height');
      config.settings[6].settings[11].value = settings.messageInputMaxHeight;
    }
    else runtime.api.Data.save('message-input-max-height', settings.messageInputMaxHeight);
    if (runtime.api.Data.load('window-bar-height') !== undefined) {
      settings.windowBarHeight = runtime.api.Data.load('window-bar-height');
      config.settings[6].settings[12].value = settings.windowBarHeight;
    }
    else runtime.api.Data.save('window-bar-height', settings.windowBarHeight);

    if (runtime.api.Data.load('channel-list-width') !== undefined) {
      settings.channelListWidth = runtime.api.Data.load('channel-list-width');
    }
    else runtime.api.Data.save('channel-list-width', settings.channelListWidth);
    if (runtime.api.Data.load('members-list-width') !== undefined) {
      settings.membersListWidth = runtime.api.Data.load('members-list-width');
    }
    else runtime.api.Data.save('members-list-width', settings.membersListWidth);
    if (runtime.api.Data.load('profile-panel-width') !== undefined) {
      settings.profilePanelWidth = runtime.api.Data.load('profile-panel-width');
    }
    else runtime.api.Data.save('profile-panel-width', settings.profilePanelWidth);
    if (runtime.api.Data.load('search-panel-width') !== undefined) {
      settings.searchPanelWidth = runtime.api.Data.load('search-panel-width');
    }
    else runtime.api.Data.save('search-panel-width', settings.searchPanelWidth);
    if (runtime.api.Data.load('forum-popout-width') !== undefined) {
      settings.forumPopoutWidth = runtime.api.Data.load('forum-popout-width');
    }
    else runtime.api.Data.save('forum-popout-width', settings.forumPopoutWidth);
  };

  // Initializes integration with various themes
  initThemeIntegration = () => {
    // Initialize Horizontal Server List integration
    try {
      for (var i = 0; i < document.styleSheets.length; i++) {
        try {
          if (document.styleSheets[i].ownerNode.getAttribute('id') === 'HorizontalServerList-theme-container')
            runtime.themes.horizontalServerList = true;
        }
        catch {}
      }
    }
    catch {}

    // Initialize Dark Matter List integration
    try {
      for (var i = 0; i < document.styleSheets.length; i++) {
        try {
          if (document.styleSheets[i].ownerNode.getAttribute('id') === 'Dark-Matter')
            runtime.themes.darkMatter = true;
        }
        catch {}
      }
    }
    catch {}

    // Fix incompatibility between HSL and Dark Matter
    if (runtime.themes.horizontalServerList && runtime.themes.darkMatter) {
      elements.settingsContainerBase.style.setProperty('width', '100%', 'important');
      elements.settingsContainerBase.style.setProperty('left', '0px', 'important');
      elements.appBase.style.setProperty('min-width', '100vw', 'important');
    }
  };

  // Creates and inserts CollapsibleUI toolbar
  initToolbar = () => {
    // Define & add toolbar container
    // Original icon sources:
    //   - Discord (Some icons are identical to their vanilla counterparts)
    //   - Bootstrap Icons: https://icons.getbootstrap.com/
    //   - Jam Icons: https://jam-icons.com/
    // Icons modified to fit Discord's theme by me
    elements.toolbarContainer = document.createElement('div');
    elements.toolbarContainer.setAttribute('id', 'cui-toolbar-container');
    elements.toolbarContainer.classList.add('collapsible-ui-element');
    elements.toolbarContainer.style.setProperty('align-items', 'right', 'important');
    elements.toolbarContainer.style.setProperty('display', 'flex', 'important');
    elements.toolbarContainer.style.setProperty('padding', '0px', 'important');
    elements.toolbarContainer.style.setProperty('margin', '0px', 'important');
    elements.toolbarContainer.style.setProperty('border', '0px', 'important');
    elements.toolbarContainer.innerHTML = '<div id="cui-icon-insert-point" style="display: none;"></div>';

    // Insert icons in the correct spot
    try {
      if (elements.inviteToolbar || elements.searchBar) {
        if (elements.moreButton)
          elements.toolbar.insertBefore(elements.toolbarContainer, elements.moreButton.parentElement.parentElement);
        else
          elements.toolbar.insertBefore(elements.toolbarContainer, (elements.inviteToolbar)
            ? elements.inviteToolbar.nextElementSibling
            : elements.searchBar);
      }
      else
        elements.toolbar.insertBefore(elements.toolbarContainer, elements.toolbar.childNodes[elements.toolbar.childNodes.length - 2]);
    }
    catch {
      elements.toolbar.appendChild(elements.toolbarContainer);
    }

    // Define & add new toolbar icons
    var buttonsActive = settings.buttonIndexes;
    for (var i = 1; i <= settings.buttonIndexes.length; i++) { // lgtm[js/unused-index-variable]
      if (i === settings.buttonIndexes[constants.I_SERVER_LIST]) {
        if (settings.buttonIndexes[constants.I_SERVER_LIST]) {
          runtime.buttons[constants.I_SERVER_LIST] = this.addToolbarIcon(runtime.localeLabels.serverList,
            '<path fill="currentColor" d="M18.9,2.5H5.1C2.8,2.5,1,4.3,1,6.6v1'
              + '0.8c0,2.3,1.8,4.1,4.1,4.1h13.7c2.3,0,4.1-1.8,4.1-4.1V6.6C23,4.'
              + '3,21.2,2.5,18.9,2.5z M21.6,17.4c0,1.5-1.2,2.7-2.8,2.7H8.3c-1.5'
              + ',0-2.7-1.2-2.7-2.7V6.6c0-1.5,1.2-2.7,2.8-2.7h10.5c1.5,0,2.8,1.'
              + '2,2.8,2.7V17.4z"/>', '0 0 24 24');
        }
        else {
          runtime.buttons[constants.I_SERVER_LIST] = false;
          buttonsActive[constants.I_SERVER_LIST] = 0;
        }
      }
      if (i === settings.buttonIndexes[constants.I_CHANNEL_LIST]) {
        if (settings.buttonIndexes[constants.I_CHANNEL_LIST]) {
          runtime.buttons[constants.I_CHANNEL_LIST] = this.addToolbarIcon(runtime.localeLabels.channelList,
            '<path fill="currentColor" d="M4.1,12c0,0.9-0.7,1.6-1.6,1.6S1,12.'
              + '9,1,12s0.7-1.6,1.6-1.6S4.1,11.1,4.1,12z M2.6,16.4c-0.9,0-1.6,0'
              + '.7-1.6,1.6c0,0.9,0.7,1.6,1.6,1.6s1.6-0.7,1.6-1.6C4.1,17.1,3.4,'
              + '16.4,2.6,16.4z M2.6,4.5C1.7,4.5,1,5.2,1,6.1s0.7,1.6,1.6,1.6s1.'
              + '6-0.7,1.6-1.6S3.4,4.5,2.6,4.5z M7.4,7C7.5,7,7.5,7,7.4,7C7.5,7,'
              + '7.5,7,7.4,7H22c0,0,0,0,0,0c0,0,0,0,0,0c0.6,0,1-0.4,1-1c0-0.5-0'
              + '.4-1-1-1c0,0,0,0,0,0c0,0,0,0,0,0H7.5c0,0,0,0,0,0c0,0,0,0,0,0c-'
              + '0.6,0-1,0.4-1,1C6.4,6.6,6.9,7,7.4,7z M7.4,13C7.5,13,7.5,13,7.4'
              + ',13C7.5,13,7.5,13,7.4,13h9c0,0,0,0,0,0c0,0,0,0,0,0c0.6,0,1-0.4'
              + ',1-1c0-0.5-0.4-1-1-1c0,0,0,0,0,0c0,0,0,0,0,0H7.5c0,0,0,0,0,0c0'
              + ',0,0,0,0,0c-0.6,0-1,0.4-1,1C6.4,12.5,6.9,13,7.4,13z M7.4,18.9C'
              + '7.5,18.9,7.5,18.9,7.4,18.9C7.5,18.9,7.5,18.9,7.4,18.9l12.4,0c0'
              + ',0,0,0,0,0c0,0,0,0,0,0c0.6,0,1-0.4,1-1c0-0.5-0.4-1-1-1c0,0,0,0'
              + ',0,0c0,0,0,0,0,0L7.5,17c0,0,0,0,0,0c0,0,0,0,0,0c-0.6,0-1,0.4-1'
              + ',1C6.4,18.5,6.9,18.9,7.4,18.9z"/>', '0 0 24 24');
        }
        else {
          runtime.buttons[constants.I_CHANNEL_LIST] = false;
          buttonsActive[constants.I_CHANNEL_LIST] = 0;
        }
      }
      if (i === settings.buttonIndexes[constants.I_MESSAGE_INPUT]) {
        if (settings.buttonIndexes[constants.I_MESSAGE_INPUT] && elements.messageInput) {
          runtime.buttons[constants.I_MESSAGE_INPUT] = this.addToolbarIcon(runtime.localeLabels.messageInput,
            '<path fill="currentColor" d="M7.5,3c0-0.4,0.3-0.8,0.8-0.8c1.3,0,'
              + '2.4,0.4,3.1,0.8c0.3,0.1,0.5,0.3,0.7,0.4c0.2-0.1,0.4-0.3,0.7-0.'
              + '4c0.9-0.5,2-0.8,3.1-0.8c0.4,0,0.8,0.3,0.8,0.8c0,0.4-0.3,0.8-0.'
              + '8,0.8c-1,0-1.8,0.3-2.3,0.7c-0.2,0.1-0.4,0.3-0.7,0.4v6.4h0.8c0.'
              + '4,0,0.8,0.3,0.8,0.8c0,0.4-0.3,0.8-0.8,0.8h-0.8v6.4c0.1,0.1,0.4'
              + ',0.3,0.7,0.4c0.6,0.3,1.4,0.6,2.3,0.6c0.4,0,0.8,0.3,0.8,0.8c0,0'
              + '.4-0.3,0.8-0.8,0.8c-1.1,0-2.1-0.3-3.1-0.9c-0.2-0.1-0.4-0.3-0.7'
              + '-0.4c-0.2,0.2-0.4,0.3-0.7,0.4c-0.9,0.5-2,0.8-3.1,0.8c-0.4,0-0.'
              + '8-0.3-0.8-0.8c0-0.4,0.3-0.8,0.8-0.8c1,0,1.8-0.3,2.3-0.7c0.3-0.'
              + '2,0.5-0.3,0.7-0.4v-6.4h-0.8c-0.4,0-0.8-0.3-0.8-0.8c0-0.4,0.3-0'
              + '.8,0.8-0.8h0.8V4.8c-0.2-0.2-0.4-0.3-0.7-0.4C9.9,4,9.1,3.8,8.2,'
              + '3.8C7.8,3.8,7.5,3.4,7.5,3z"/><path fill="currentColor" d="M15.'
              + '7,7.5h4.5c1.2,0,2.2,1,2.2,2.2v4.5c0,1.2-1,2.2-2.2,2.2h-4.5c-0.'
              + '4,0-0.7,0.3-0.7,0.8l0,0c0,0.4,0.3,0.8,0.7,0.8h4.5c2.1,0,3.8-1.'
              + '7,3.8-3.7V9.7C24,7.7,22.3,6,20.2,6h-4.5C15.3,6,15,6.3,15,6.7v0'
              + 'C15,7.2,15.3,7.5,15.7,7.5z M9,6.8L9,6.8C9,6.3,8.7,6,8.3,6H3.7C'
              + '1.7,6,0,7.7,0,9.7v4.5C0,16.3,1.7,18,3.7,18h4.5C8.7,18,9,17.7,9'
              + ',17.2l0,0c0-0.4-0.3-0.8-0.7-0.8H3.7c-1.2,0-2.2-1-2.2-2.2V9.7c0'
              + '-1.2,1-2.2,2.2-2.2h4.5C8.7,7.5,9,7.2,9,6.8z"/>', '0 0 24 24');
        }
        else {
          runtime.buttons[constants.I_MESSAGE_INPUT] = false;
          buttonsActive[constants.I_MESSAGE_INPUT] = 0;
        }
      }
      if (i === settings.buttonIndexes[constants.I_WINDOW_BAR]) {
        if (settings.buttonIndexes[constants.I_WINDOW_BAR] && elements.windowBar
          && !(runtime.api.Plugins.isEnabled('OldTitleBar'))) {
          runtime.buttons[constants.I_WINDOW_BAR] = this.addToolbarIcon(runtime.localeLabels.windowBar,
            '<path fill="currentColor" d="M22.3,4.3C22,3.8,21.5,3.4,21,3.1c-0'
              + '.6-0.4-1.4-0.6-2.2-0.6H5.1C4.3,2.5,3.6,2.7,3,3.1C2.6,3.3,2.2,3'
              + '.6,1.9,4C1.3,4.7,1,5.6,1,6.6v10.9c0,2.2,1.8,4.1,4.1,4.1h13.7c2'
              + '.3,0,4.1-1.8,4.1-4.1V6.6C23,5.7,22.8,5,22.3,4.3z M10.5,3.6c0.5'
              + ',0,0.9,0.4,0.9,0.9c0,0.5-0.4,0.9-0.9,0.9c-0.5,0-1-0.4-1-0.9C9.'
              + '5,4,9.9,3.6,10.5,3.6z M7.6,3.6c0.5,0,0.9,0.4,0.9,0.9c0,0.5-0.4'
              + ',0.9-0.9,0.9c-0.5,0-1-0.4-1-0.9C6.7,4,7.1,3.6,7.6,3.6z M4.8,3.'
              + '6c0.5,0,1,0.4,1,0.9c0,0.5-0.4,0.9-1,0.9c-0.5,0-0.9-0.4-0.9-0.9'
              + 'C3.9,4,4.3,3.6,4.8,3.6z M21.6,17.4c0,0.7-0.3,1.4-0.8,1.9c-0.1,'
              + '0.1-0.1,0.1-0.2,0.2c-0.1,0.1-0.1,0.1-0.2,0.2c-0.2,0.2-0.5,0.3-'
              + '0.7,0.3c-0.3,0.1-0.5,0.1-0.8,0.1H5.1c-0.3,0-0.6,0-0.8-0.1c-0.3'
              + '-0.1-0.5-0.2-0.7-0.3c-0.1,0-0.2-0.1-0.2-0.2c-0.1-0.1-0.1-0.1-0'
              + '.2-0.2c-0.5-0.5-0.8-1.2-0.8-1.9V9.3c0-1.5,1.2-2.8,2.8-2.8h13.8'
              + 'c1.5,0,2.7,1.2,2.7,2.7V17.4z"/>', '0 0 24 24');
        }
        else {
          runtime.buttons[constants.I_WINDOW_BAR] = false;
          buttonsActive[constants.I_WINDOW_BAR] = 0;
        }
      }
      if (i === settings.buttonIndexes[constants.I_MEMBERS_LIST]) {
        if (settings.buttonIndexes[constants.I_MEMBERS_LIST] && elements.membersList) {
          runtime.buttons[constants.I_MEMBERS_LIST] = this.addToolbarIcon(runtime.localeLabels.membersList,
            '<path fill="currentColor" d="M14.5 8a3 3 0 1 0-2.7-4.3c-.2.4.06.'
              + '86.44 1.12a5 5 0 0 1 2.14 3.08c.01.06.06.1.12.1ZM18.44 17.27c.'
              + '15.43.54.73 1 .73h1.06c.83 0 1.5-.67 1.5-1.5a7.5 7.5 0 0 0-6.5'
              + '-7.43c-.55-.08-.99.38-1.1.92-.06.3-.15.6-.26.87-.23.58-.05 1.3'
              + '.47 1.63a9.53 9.53 0 0 1 3.83 4.78ZM12.5 9a3 3 0 1 1-6 0 3 3 0'
              + ' 0 1 6 0ZM2 20.5a7.5 7.5 0 0 1 15 0c0 .83-.67 1.5-1.5 1.5a.2.2'
              + ' 0 0 1-.2-.16c-.2-.96-.56-1.87-.88-2.54-.1-.23-.42-.15-.42.1v2'
              + '.1a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2.1c0-.25-.31-.33-.42-'
              + '.1-.32.67-.67 1.58-.88 2.54a.2.2 0 0 1-.2.16A1.5 1.5 0 0 1 2 '
              + '20.5Z"/>', '0 0 24 24');
        }
        else {
          runtime.buttons[constants.I_MEMBERS_LIST] = false;
          buttonsActive[constants.I_MEMBERS_LIST] = 0;
        }
      }
      if (i === settings.buttonIndexes[constants.I_USER_AREA]) {
        if (settings.buttonIndexes[constants.I_USER_AREA] && elements.userArea) {
          runtime.buttons[constants.I_USER_AREA] = this.addToolbarIcon(runtime.localeLabels.userArea,
            '<path fill="currentColor" d="M21.2,7.6H2.8C1.3,7.6,0,8.8,0,10.3v'
              + '3.3c0,1.5,1.3,2.8,2.8,2.8h18.4c1.5,0,2.8-1.3,2.8-2.8v-3.3C24,8'
              + '.8,22.7,7.6,21.2,7.6z M17.4,10.7c0.7,0,1.3,0.6,1.3,1.3s-0.6,1.'
              + '3-1.3,1.3s-1.3-0.6-1.3-1.3S16.7,10.7,17.4,10.7z M3.9,10.1c1.1,'
              + '0,1.9,0.9,1.9,1.9S5,13.9,3.9,13.9S2,13.1,2,12S2.9,10.1,3.9,10.'
              + '1z M20.7,10.7c0.7,0,1.3,0.6,1.3,1.3s-0.6,1.3-1.3,1.3s-1.3-0.6-'
              + '1.3-1.3S20,10.7,20.7,10.7z M6.5,10.8C6.5,10.8,6.5,10.8,6.5,10.'
              + '8c0-0.4,0.3-0.7,0.8-0.7h6.3c0.4,0,0.7,0.3,0.8,0.7c0,0,0,0,0,0v'
              + '0c0,0.4-0.3,0.8-0.8,0.8H7.2C6.8,11.6,6.5,11.2,6.5,10.8L6.5,10.'
              + '8z M7.2,12.4h6.3c0.4,0,0.8,0.3,0.8,0.8c0,0,0,0,0,0.1c0,0.4-0.4'
              + ',0.7-0.7,0.7H7.2c-0.4,0-0.7-0.3-0.7-0.7c0,0,0,0,0-0.1C6.5,12.8'
              + ',6.8,12.4,7.2,12.4z"/>', '0 0 24 24');
        }
        else {
          runtime.buttons[constants.I_USER_AREA] = false;
          buttonsActive[constants.I_USER_AREA] = 0;
        }
      }
      if (i === settings.buttonIndexes[constants.I_CALL_WINDOW]) {
        if (settings.buttonIndexes[constants.I_CALL_WINDOW]
          && elements.callContainer()) {
          runtime.buttons[constants.I_CALL_WINDOW] = this.addToolbarIcon(runtime.localeLabels.callWindow,
            '<path fill="currentColor" d="M20.7,16.2c-0.1-0.1-0.2-0.2-0.3-0.'
              + '2c-0.5-0.4-1-0.8-1.6-1.1l-0.3-0.2c-0.7-0.5-1.3-0.7-1.8-0.7c-0.'
              + '8,0-1.4,0.4-2,1.2c-0.2,0.4-0.5,0.5-0.9,0.5c-0.3,0-0.5-0.1-0.7-'
              + '0.2c-2.2-1-3.7-2.5-4.6-4.4C8,10.2,8.2,9.5,8.9,9c0.4-0.3,1.2-0.'
              + '8,1.2-1.8C10,6,7.4,2.5,6.3,2.1C5.9,2,5.4,2,4.9,2.1C3.7,2.5,2.8'
              + ',3.3,2.3,4.2c-0.4,0.9-0.4,2,0.1,3.2C3.7,10.7,5.6,13.6,8,16c2.4'
              + ',2.3,5.2,4.2,8.6,5.7c0.3,0.1,0.6,0.2,0.9,0.3c0.1,0,0.1,0,0.2,0'
              + 'c0,0,0.1,0,0.1,0h0c1.6,0,3.5-1.4,4.1-3.1C22.4,17.5,21.4,16.8,'
              + '20.7,16.2z"/>', '0 0 24 24');
        }
        else {
          runtime.buttons[constants.I_CALL_WINDOW] = false;
          buttonsActive[constants.I_CALL_WINDOW] = 0;
        }
      }
      if (i === settings.buttonIndexes[constants.I_USER_PROFILE]) {
        if (settings.buttonIndexes[constants.I_USER_PROFILE] && elements.userProfile) {
          runtime.buttons[constants.I_USER_PROFILE] = this.addToolbarIcon(runtime.localeLabels.userProfile,
            '<path fill="currentColor" fill-rule="evenodd" d="M23 12.38c-.02.'
              + '38-.45.58-.78.4a6.97 6.97 0 0 0-6.27-.08.54.54 0 0 1-.44 0 8.97'
              + ' 8.97 0 0 0-11.16 3.55c-.1.15-.1.35 0 .5.37.58.8 1.13 1.28 1.61'
              + '.24.24.64.15.8-.15.19-.38.39-.73.58-1.02.14-.21.43-.1.4.15l-.19'
              + ' 1.96c-.02.19.07.37.23.47A8.96 8.96 0 0 0 12 21a.4.4 0 0 1 .38'
              + '.27c.1.33.25.65.4.95.18.34-.02.76-.4.77L12 23a11 11 0 1 1 11-10'
              + '.62ZM15.5 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule='
              + '"evenodd"></path><path fill="currentColor" d="M24 19a5 5 0 1 1'
              + '-10 0 5 5 0 0 1 10 0Z"></path>', '0 0 24 24');
        }
        else {
          runtime.buttons[constants.I_USER_PROFILE] = false;
          buttonsActive[constants.I_USER_PROFILE] = 0;
        }
      }
    }

    return buttonsActive;
  };

  // Initializes UI styles, transitions, and collapsed elements
  initUI = () => {
    var _this = this; // Abstract CollapsibleUI as a variable

    // Adjust UI element styling in preparation for transitions
    document.querySelectorAll('.collapsible-ui-element')
      .forEach(e => e.style.transition = 'max-width ' + settings.transitionSpeed
        + 'ms, margin ' + settings.transitionSpeed + 'ms, padding '
        + settings.transitionSpeed + 'ms');
    elements.toolbar.style.setProperty('transition', 'max-width ' + settings.transitionSpeed + 'ms', 'important');

    if (elements.windowBar) {
      if (runtime.themes.darkMatter)
        elements.windowBar.style.setProperty('height', '26px', 'important');
      else
        elements.windowBar.style.setProperty('height', settings.windowBarHeight + 'px', 'important');
    }
    if (elements.membersList) {
      elements.membersList.style.setProperty('overflow', 'hidden', 'important');
      elements.membersList.style.setProperty('min-width', 'var(--cui-members-width)', 'important');
      elements.membersList.style.setProperty('min-height', '100%', 'important');
      elements.membersList.style.setProperty('flex-basis', 'auto', 'important');
    }
    if (elements.userProfile) {
      elements.userProfile.style.setProperty('overflow', 'hidden', 'important');
      elements.userProfile.style.setProperty('min-height', '100%', 'important');
      elements.userProfile.style.setProperty('width', 'var(--cui-profile-width)', 'important');
    }
    if (elements.userProfileWrapper)
      elements.userProfileWrapper.style.setProperty('width', 'auto', 'important');
    if (elements.messageInput)
      elements.messageInput.style.setProperty('max-height', settings.messageInputMaxHeight + 'px', 'important');
    if (elements.callContainer())
      elements.callContainer().style.setProperty('min-height', '0px', 'important');
    if (document.querySelector('.' + modules.dms?.channel))
      document.querySelectorAll('.' + modules.dms?.channel)
        .forEach(e => e.style.setProperty('max-width', '200000px'), 'important');
    if (elements.avatarWrapper)
      elements.avatarWrapper.style.setProperty('min-width', '0', 'important');
    if (elements.channelList)
      elements.channelList.style.setProperty('overflow', 'hidden', 'important');

    // Read stored user data to decide active state of Server List button
    if (elements.serverList) {
      if (runtime.collapsed[constants.I_SERVER_LIST]) {
        this.floatElement(constants.I_SERVER_LIST, false);
        if (settings.buttonIndexes[constants.I_SERVER_LIST] || settings.collapseDisabledButtons) {
          if (!runtime.api.Data.load('server-list-button-active')) {
            if (runtime.buttons[constants.I_SERVER_LIST])
              runtime.buttons[constants.I_SERVER_LIST].classList.remove(modules.icons?.selected);
            elements.serverList.style.setProperty('width', settings.collapseSize + 'px', 'important');
            if (runtime.themes.darkMatter) {
              elements.settingsContainerBase.style.setProperty('width', '100%', 'important');
              elements.settingsContainerBase.style.setProperty('left', '0px', 'important');
              elements.appBase.style.setProperty('min-width', '100vw', 'important');
            }
            if (runtime.themes.horizontalServerList) {
              elements.appBase.style.setProperty('top', '0px', 'important');
            }
          }
          else if (runtime.api.Data.load('server-list-button-active')) {
            if (runtime.buttons[constants.I_SERVER_LIST])
              runtime.buttons[constants.I_SERVER_LIST].classList.add(modules.icons?.selected);
          }
          else {
            runtime.api.Data.save('server-list-button-active', true);
            if (runtime.buttons[constants.I_SERVER_LIST])
              runtime.buttons[constants.I_SERVER_LIST].classList.add(modules.icons?.selected);
          }
        }
        else
          runtime.api.Data.save('server-list-button-active', true);
      }
      else this.floatElement(constants.I_SERVER_LIST, true);
    }

    // Read stored user data to decide active state of Channel List button
    if (elements.channelList) {
      if (runtime.collapsed[constants.I_CHANNEL_LIST]) {
        this.floatElement(constants.I_CHANNEL_LIST, false);
        if (settings.buttonIndexes[constants.I_CHANNEL_LIST] || settings.collapseDisabledButtons) {
          if (!runtime.api.Data.load('channel-list-button-active')) {
            if (runtime.buttons[constants.I_CHANNEL_LIST])
              runtime.buttons[constants.I_CHANNEL_LIST].classList.remove(modules.icons?.selected);
            elements.channelList.style
              .setProperty('transition', 'width ' + settings.transitionSpeed + 'ms', 'important');
            elements.channelList.style
              .setProperty('width', settings.collapseSize + 'px', 'important');
            if (runtime.themes.darkMatter) {
              elements.settingsContainer.style.setProperty('display', 'none', 'important');
              if (elements.spotifyContainer)
                elements.spotifyContainer.style.setProperty('display', 'none', 'important');
            }
          }
          else if (runtime.api.Data.load('channel-list-button-active')) {
            if (runtime.buttons[constants.I_CHANNEL_LIST])
              runtime.buttons[constants.I_CHANNEL_LIST].classList.add(modules.icons?.selected);
          }
          else {
            runtime.api.Data.save('channel-list-button-active', true);
            if (runtime.buttons[constants.I_CHANNEL_LIST])
              runtime.buttons[constants.I_CHANNEL_LIST].classList.add(modules.icons?.selected);
          }
        }
        else
          runtime.api.Data.save('channel-list-button-active', true);
      }
      else this.floatElement(constants.I_CHANNEL_LIST, true);
    }

    // Read stored user data to decide active state of Message Bar button
    if (elements.messageInput) {
      if (runtime.collapsed[constants.I_MESSAGE_INPUT]) {
        if (settings.buttonIndexes[constants.I_MESSAGE_INPUT] || settings.collapseDisabledButtons) {
          if (!runtime.api.Data.load('message-input-button-active')) {
            if (runtime.buttons[constants.I_MESSAGE_INPUT])
              runtime.buttons[constants.I_MESSAGE_INPUT].classList.remove(modules.icons?.selected);
            if (!(document.querySelector('[data-slate-string="true"]')?.innerHTML)
              && !(document.querySelector('.' + modules.attachments?.channelAttachmentArea))
              && !(document.querySelector('.' + modules.input?.expressionPickerPositionLayer))
              && !(document.querySelector('#channel-attach'))) {
              elements.messageInput.style
                .setProperty('max-height', settings.collapseSize + 'px', 'important');
              elements.messageInput.style.setProperty('overflow', 'hidden', 'important');
            }
          }
          else if (runtime.api.Data.load('message-input-button-active')) {
            if (runtime.buttons[constants.I_MESSAGE_INPUT])
              runtime.buttons[constants.I_MESSAGE_INPUT].classList.add(modules.icons?.selected);
          }
          else {
            runtime.api.Data.save('message-input-button-active', true);
            if (runtime.buttons[constants.I_MESSAGE_INPUT])
              runtime.buttons[constants.I_MESSAGE_INPUT].classList.add(modules.icons?.selected);
          }
        }
        else
          runtime.api.Data.save('message-input-button-active', true);
      }
    }

    // Read stored user data to decide active state of Window Bar button
    if (elements.windowBar) {
      if (runtime.collapsed[constants.I_WINDOW_BAR]) {
        if (settings.buttonIndexes[constants.I_WINDOW_BAR] || settings.collapseDisabledButtons) {
          if (!runtime.api.Data.load('window-bar-button-active')) {
            if (runtime.buttons[constants.I_WINDOW_BAR])
              runtime.buttons[constants.I_WINDOW_BAR].classList.remove(modules.icons?.selected);
            elements.windowBar.style.setProperty('height', '0px', 'important');
            if (runtime.themes.darkMatter)
              elements.windowBar.style.setProperty('opacity', '0', 'important');
            elements.windowBar.style.setProperty('padding', '0px', 'important');
            elements.windowBar.style.setProperty('margin', '0px', 'important');
            elements.windowBar.style.setProperty('overflow', 'hidden', 'important');
            elements.wordMark?.style.setProperty('display', 'none', 'important');
          }
          else if (runtime.api.Data.load('window-bar-button-active')) {
            if (runtime.buttons[constants.I_WINDOW_BAR])
              runtime.buttons[constants.I_WINDOW_BAR].classList.add(modules.icons?.selected);
          }
          else {
            runtime.api.Data.save('window-bar-button-active', true);
            if (runtime.buttons[constants.I_WINDOW_BAR])
              runtime.buttons[constants.I_WINDOW_BAR].classList.add(modules.icons?.selected);
          }
        }
        else
          runtime.api.Data.save('window-bar-button-active', true);
      }
    }

    // Read stored user data to decide active state of Members List button
    if (elements.membersList) {
      if (runtime.collapsed[constants.I_MEMBERS_LIST]) {
        this.floatElement(constants.I_MEMBERS_LIST, false);
        if (settings.buttonIndexes[constants.I_MEMBERS_LIST] || settings.collapseDisabledButtons) {
          if (!runtime.api.Data.load('members-list-button-active')) {
            if (runtime.buttons[constants.I_MEMBERS_LIST])
              runtime.buttons[constants.I_MEMBERS_LIST].classList.remove(modules.icons?.selected);
            elements.membersList.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
            elements.contentWindow.style
              .setProperty('transition', 'max-width ' + settings.transitionSpeed + 'ms', 'important');
            elements.membersList.style
              .setProperty('width', settings.collapseSize + 'px', 'important');
            elements.membersList.style
              .setProperty('min-width', settings.collapseSize + 'px', 'important');
            elements.contentWindow.style
              .setProperty('max-width', 'calc(100% - ' + settings.collapseSize + 'px)', 'important');
          }
          else if (runtime.api.Data.load('members-list-button-active')) {
            if (runtime.buttons[constants.I_MEMBERS_LIST])
              runtime.buttons[constants.I_MEMBERS_LIST].classList.add(modules.icons?.selected);
            if (settings.membersListWidth !== 0) {
              elements.membersList.style
                .setProperty('width', settings.membersListWidth + 'px', 'important');
              elements.membersList.style
                .setProperty('min-width', settings.membersListWidth + 'px', 'important');
              elements.contentWindow.style
                .setProperty('max-width', 'calc(100% - ' + settings.membersListWidth + 'px)', 'important');
            }
            else {
              elements.membersList.style
                .setProperty('width', 'var(--cui-members-width)', 'important');
              elements.membersList.style
                .setProperty('min-width', 'var(--cui-members-width)', 'important');
              elements.contentWindow.style
                .setProperty('max-width', 'calc(100% - var(--cui-members-width))', 'important');
            }
          }
          else {
            runtime.api.Data.save('members-list-button-active', true);
            if (runtime.buttons[constants.I_MEMBERS_LIST])
              runtime.buttons[constants.I_MEMBERS_LIST].classList.add(modules.icons?.selected);
            if (settings.membersListWidth !== 0) {
              elements.membersList.style
                .setProperty('width', settings.membersListWidth + 'px', 'important');
              elements.membersList.style
                .setProperty('min-width', settings.membersListWidth + 'px', 'important');
              elements.contentWindow.style
                .setProperty('max-width', 'calc(100% - ' + settings.membersListWidth + 'px)', 'important');
            }
            else {
              elements.membersList.style
                .setProperty('width', 'var(--cui-members-width)', 'important');
              elements.membersList.style
                .setProperty('min-width', 'var(--cui-members-width)', 'important');
              elements.contentWindow.style
                .setProperty('max-width', 'calc(100% - var(--cui-members-width))', 'important');
            }
          }
        }
        else
          runtime.api.Data.save('members-list-button-active', true);
      }
      else this.floatElement(constants.I_MEMBERS_LIST, true);
    }

    // Read stored user data to decide active state of Profile Panel button
    if (elements.userProfile) {
      if (runtime.collapsed[constants.I_USER_PROFILE]) {
        this.floatElement(constants.I_USER_PROFILE, false);
        if (settings.buttonIndexes[constants.I_USER_PROFILE] || settings.collapseDisabledButtons) {
          if (!runtime.api.Data.load('user-profile-button-active')) {
            if (runtime.buttons[constants.I_USER_PROFILE])
              runtime.buttons[constants.I_USER_PROFILE].classList.remove(modules.icons?.selected);
            elements.userProfile.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
            elements.userProfile.style
              .setProperty('width', settings.collapseSize + 'px', 'important');
          }
          else if (runtime.api.Data.load('user-profile-button-active')) {
            if (runtime.buttons[constants.I_USER_PROFILE])
              runtime.buttons[constants.I_USER_PROFILE].classList.add(modules.icons?.selected);
            if (settings.profilePanelWidth !== 0)
              elements.userProfile.style
                .setProperty('width', settings.profilePanelWidth + 'px', 'important');
            else
              elements.userProfile.style
                .setProperty('width', 'var(--cui-profile-width)', 'important');
          }
          else {
            runtime.api.Data.save('user-profile-button-active', true);
            if (runtime.buttons[constants.I_USER_PROFILE])
              runtime.buttons[constants.I_USER_PROFILE].classList.add(modules.icons?.selected);
            if (settings.profilePanelWidth !== 0)
              elements.userProfile.style
                .setProperty('width', settings.profilePanelWidth + 'px', 'important');
            else
              elements.userProfile.style
                .setProperty('width', 'var(--cui-profile-width)', 'important');
          }
        }
        else
          runtime.api.Data.save('user-profile-button-active', true);
      }
      else this.floatElement(constants.I_USER_PROFILE, true);
    }

    // Read stored user data to decide active state of User Area button
    if (elements.userArea) {
      if (runtime.collapsed[constants.I_USER_AREA]) {
        if (settings.buttonIndexes[constants.I_USER_AREA] || settings.collapseDisabledButtons) {
          if (!runtime.api.Data.load('user-area-button-active')) {
            if (runtime.buttons[constants.I_USER_AREA])
              runtime.buttons[constants.I_USER_AREA].classList.remove(modules.icons?.selected);
            elements.userArea.style
              .setProperty('max-height', settings.collapseSize + 'px', 'important');
          }
          else if (runtime.api.Data.load('user-area-button-active')) {
            if (runtime.buttons[constants.I_USER_AREA])
              runtime.buttons[constants.I_USER_AREA].classList.add(modules.icons?.selected);
          }
          else {
            runtime.api.Data.save('user-area-button-active', true);
            if (runtime.buttons[constants.I_USER_AREA])
              runtime.buttons[constants.I_USER_AREA].classList.add(modules.icons?.selected);
          }
        }
        else
          runtime.api.Data.save('user-area-button-active', true);
      }
    }

    // Read stored user data to decide active state of Call Container button
    if (elements.callContainer()) {
      if (runtime.collapsed[constants.I_CALL_WINDOW]) {
        if (settings.buttonIndexes[constants.I_CALL_WINDOW] || settings.collapseDisabledButtons) {
          if (!runtime.api.Data.load('call-window-button-active')) {
            if (runtime.buttons[constants.I_CALL_WINDOW])
              runtime.buttons[constants.I_CALL_WINDOW].classList.remove(modules.icons?.selected);
            if (elements.callContainer()) {
              elements.callContainer().style.setProperty('max-height', '0px', 'important');
              if (document.querySelector('.' + modules.callMembers?.voiceCallWrapper))
                document.querySelector('.' + modules.callMembers?.voiceCallWrapper).style
                  .setProperty('display', 'none', 'important');
            }
          }
          else if (runtime.api.Data.load('call-window-button-active')) {
            if (runtime.buttons[constants.I_CALL_WINDOW])
              runtime.buttons[constants.I_CALL_WINDOW].classList.add(modules.icons?.selected);
          }
          else {
            runtime.api.Data.save('call-window-button-active', true);
            if (runtime.buttons[constants.I_CALL_WINDOW])
              runtime.buttons[constants.I_CALL_WINDOW].classList.add(modules.icons?.selected);
          }
        }
        else
          runtime.api.Data.save('call-window-button-active', true);
      }
    }

    // Create root stylesheet
    runtime.api.DOM.addStyle('cui-root', `
      :root {
        --cui-members-width: 240px;
        --cui-profile-width: 340px;
        --cui-search-width: 418px;
        --cui-popout-width: 450px;
      }

      ::-webkit-scrollbar {
        width: 0px;
        background: transparent;
      }
      
      ::-webkit-resizer {
        display: none;
      }

      .${modules.threads?.grid}>div:first-child,
      .${modules.threads?.headerRow},
      .${modules.threads?.list}>div:first-child {
        min-width: 0px !important;
      }

      .${modules.searchHeader?.searchHeaderTabList} {
        justify-content: end !important;
      }

      .${modules.panel?.inner} .${modules.effects?.profileEffects} {
        transform: scaleX(-1);
      }
    `);

    // Handle resizing channel list
    if (settings.resizableChannelList) {
      elements.channelList.style.setProperty('resize', 'horizontal', 'important');
      elements.channelList.style.setProperty('max-width', '80vw', 'important');

      document.querySelectorAll('.' + modules.controls?.button)
        .forEach((e) => { e.style.setProperty('padding', '0px', 'important'); });

      document.body.addEventListener('mousedown', () => {
        elements.channelList.style.setProperty('transition', 'none', 'important');
      }, { signal: runtime.events.signal });

      if (elements.fullscreenButton) {
        elements.fullscreenButton.addEventListener('click', () => {
          if (document.fullscreenElement !== null)
            elements.channelList.style.setProperty('max-width', '80vw', 'important');
          else
            elements.channelList.style.setProperty('max-width', '0px', 'important');
        }, { signal: runtime.events.signal });
      }

      elements.channelList.addEventListener('contextmenu', (e) => {
        if (e.target !== e.currentTarget)
          return;
        try {
          runtime.observers.resize.channelList.disconnect();
        }
        catch {}
        settings.channelListWidth = 0;
        runtime.api.Data.save('channel-list-width', settings.channelListWidth);
        elements.channelList.style
          .setProperty('transition', 'width ' + settings.transitionSpeed + 'ms', 'important');
        elements.channelList.style.removeProperty('width');
        try {
          runtime.observers.resize.channelList.observe(elements.channelList, { attributeFilter: ['style'] });
        }
        catch {}
        e.preventDefault();
      }, { signal: runtime.events.signal });

      runtime.observers.resize.channelList = new MutationObserver((mutationList) => {
        try {
          if (((!runtime.collapsed[constants.I_CHANNEL_LIST])
            || (runtime.api.Data.load('channel-list-button-active')))
            && document.fullscreenElement === null) {
            var oldChannelListWidth = settings.channelListWidth;
            if (parseInt(elements.channelList.style.width)) {
              settings.channelListWidth = parseInt(elements.channelList.style.width);
              elements.channelList.style
                .setProperty('width', settings.channelListWidth + 'px', 'important');
            }
            else if (settings.channelListWidth !== 0) {
              elements.channelList.style.setProperty('transition', 'none', 'important');
              elements.channelList.style
                .setProperty('width', settings.channelListWidth + 'px', 'important');
              elements.channelList.style
                .setProperty('transition', 'width ' + settings.transitionSpeed + 'ms', 'important');
            }
            else {
              elements.channelList.style.removeProperty('width');
            }
            if (oldChannelListWidth !== settings.channelListWidth)
              runtime.api.Data.save('channel-list-width', settings.channelListWidth);
          }
        }
        catch (e) {
          console.warn('%c[CollapsibleUI] ' + '%cFailed to trigger mutationObserver width update! (see below)',
            'color: #3a71c1; font-weight: 700;', '');
          console.warn(e);
        }
      });
      runtime.observers.resize.channelList.observe(elements.channelList, { attributeFilter: ['style'] });
    }
    if (((!runtime.collapsed[constants.I_CHANNEL_LIST])
      || (runtime.api.Data.load('channel-list-button-active')))
      && settings.channelListWidth !== 0) {
      elements.channelList.style.setProperty('transition', 'none', 'important');
      elements.channelList.style
        .setProperty('width', settings.channelListWidth + 'px', 'important');
    }

    elements.channelList.style.setProperty('transition', 'none', 'important');
    elements.serverList.style
      .setProperty('transition', 'width ' + settings.transitionSpeed + 'ms', 'important');

    if (elements.windowBar)
      elements.windowBar.style
        .setProperty('transition', 'height ' + settings.transitionSpeed + 'ms', 'important');

    if (elements.membersList && elements.innerMembersList) {
      // Handle resizing members list
      if (settings.resizableMembersList) {
        elements.membersList.style.setProperty('resize', 'horizontal', 'important');
        elements.membersList.style.setProperty('max-width', '80vw', 'important');

        // Flip members list outer wrapper, then flip inner wrapper back
        // This moves the webkit resize handle to the bottom left
        // Without affecting the elements inside
        elements.membersList.style.setProperty('transform', 'scaleX(-1)', 'important');
        elements.innerMembersList.style.setProperty('transform', 'scaleX(-1)', 'important');

        elements.innerMembersList.style.setProperty('min-width', '100%', 'important');
        elements.innerMembersList.style.setProperty('max-width', '100%', 'important');
        document.querySelectorAll('.' + modules.member?.member)
          .forEach(e => e.style.setProperty('max-width', '100%'), 'important');

        // Create members resize stylesheet
        runtime.api.DOM.addStyle('cui-members', `
          .${modules.emptyState?.emptyStateHeader},
          .${modules.emptyState?.emptyStateIconContainer},
          .${modules.emptyState?.emptyStateIconContainer} + h2,
          .${modules.emptyState?.emptyStateSubtext} {
            transform: scaleX(-1);
          }

          #dv-main {
            transform: scaleX(-1);
          }
          
          #dv-mount {
            min-width: 100%;
          }
          
          #MemberCount {
            transform: scaleX(-1);
            min-width: 100%;
          }
        `);

        document.body.addEventListener('mousedown', () => {
          elements.membersList.style.setProperty('transition', 'none', 'important');
          elements.contentWindow.style.setProperty('transition', 'none', 'important');
          elements.membersList.style.setProperty('min-width', '0', 'important');
        }, { signal: runtime.events.signal });

        if (elements.fullscreenButton) {
          elements.fullscreenButton.addEventListener('click', () => {
            if (document.fullscreenElement !== null)
              elements.membersList.style.setProperty('max-width', '80vw', 'important');
            else
              elements.membersList.style.setProperty('max-width', '0px', 'important');
          }, { signal: runtime.events.signal });
        }

        elements.membersList.addEventListener('contextmenu', (e) => {
          if (e.target !== e.currentTarget)
            return;
          try {
            runtime.observers.resize.membersList.disconnect();
          }
          catch {}
          settings.membersListWidth = 0;
          runtime.api.Data.save('members-list-width', settings.membersListWidth);
          elements.membersList.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
          elements.contentWindow.style
            .setProperty('transition', 'max-width ' + settings.transitionSpeed + 'ms', 'important');
          elements.membersList.style
            .setProperty('width', 'var(--cui-members-width)', 'important');
          elements.membersList.style
            .setProperty('min-width', 'var(--cui-members-width)', 'important');
          if ((!settings.floatingPanels) || (runtime.api.Data.load(
            'members-list-button-active')))
            elements.contentWindow.style
              .setProperty('max-width', 'calc(100% - var(--cui-members-width))', 'important');
          else
            elements.contentWindow.style.setProperty('max-width', '100%', 'important');
          try {
            runtime.observers.resize.membersList.observe(elements.membersList, { attributeFilter: ['style'] });
          }
          catch {}
          e.preventDefault();
        }, { signal: runtime.events.signal });

        runtime.observers.resize.membersList = new MutationObserver((mutationList) => {
          try {
            if (((!runtime.collapsed[constants.I_MEMBERS_LIST])
              || (runtime.api.Data.load('members-list-button-active')))
              && document.fullscreenElement === null) {
              var oldMembersListWidth = settings.membersListWidth;
              if (parseInt(elements.membersList.style.width)) {
                settings.membersListWidth = parseInt(elements.membersList.style.width);
                elements.membersList.style
                  .setProperty('width', settings.membersListWidth + 'px', 'important');
                elements.membersList.style
                  .setProperty('min-width', settings.membersListWidth + 'px', 'important');
                if ((!settings.floatingPanels) || (runtime.api.Data.load(
                  'members-list-button-active')))
                  elements.contentWindow.style
                    .setProperty('max-width', 'calc(100% - ' + settings.membersListWidth + 'px)', 'important');
                else
                  elements.contentWindow.style
                    .setProperty('max-width', '100%', 'important');
              }
              else if (settings.membersListWidth !== 0) {
                elements.membersList.style.setProperty('transition', 'none', 'important');
                elements.contentWindow.style.setProperty('transition', 'none', 'important');
                elements.membersList.style
                  .setProperty('width', settings.membersListWidth + 'px', 'important');
                elements.membersList.style
                  .setProperty('min-width', settings.membersListWidth + 'px', 'important');
                if ((!settings.floatingPanels) || (runtime.api.Data.load(
                  'members-list-button-active')))
                  elements.contentWindow.style
                    .setProperty('max-width', 'calc(100% - ' + settings.membersListWidth + 'px)', 'important');
                else
                  elements.contentWindow.style.setProperty('max-width', '100%', 'important');
                elements.membersList.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
                elements.contentWindow.style
                  .setProperty('transition', 'max-width ' + settings.transitionSpeed + 'ms', 'important');
              }
              if (oldMembersListWidth !== settings.membersListWidth)
                runtime.api.Data.save('members-list-width', settings.membersListWidth);
            }
          }
          catch (e) {
            console.warn('%c[CollapsibleUI] ' + '%cFailed to trigger mutationObserver width update! (see below)',
              'color: #3a71c1; font-weight: 700;', '');
            console.warn(e);
          }
        });
        runtime.observers.resize.membersList.observe(elements.membersList, { attributeFilter: ['style'] });
      }
      if (((!runtime.collapsed[constants.I_MEMBERS_LIST])
        || (runtime.api.Data.load('members-list-button-active')))
        && settings.membersListWidth !== 0) {
        elements.membersList.style.setProperty('transition', 'none', 'important');
        elements.contentWindow.style.setProperty('transition', 'none', 'important');
        elements.membersList.style
          .setProperty('width', settings.membersListWidth + 'px', 'important');
        elements.membersList.style
          .setProperty('min-width', settings.membersListWidth + 'px', 'important');
        if ((!settings.floatingPanels) || (runtime.api.Data.load(
          'members-list-button-active')))
          elements.contentWindow.style
            .setProperty('max-width', 'calc(100% - ' + settings.membersListWidth + 'px)', 'important');
        else
          elements.contentWindow.style.setProperty('max-width', '100%', 'important');
      }

      elements.membersList.style.setProperty('transition', 'none', 'important');
      elements.contentWindow.style.setProperty('transition', 'none', 'important');
    }

    if (elements.userProfile && elements.innerUserProfile) {
      // Handle resizing profile panel
      if (settings.resizableUserProfile) {
        elements.userProfile.style.setProperty('resize', 'horizontal', 'important');
        elements.userProfile.style.setProperty('max-width', '80vw', 'important');
        elements.userProfile.style.setProperty('min-width', '0', 'important');
        elements.innerUserProfile.style.setProperty('max-width', '80vw', 'important');
        elements.innerUserProfile.style.setProperty('width', '100%', 'important');
        elements.userProfileSVGWrapper.style.maxHeight =
          elements.userProfileSVGWrapper.style.minHeight;
        elements.userProfileSVGWrapper.style.setProperty('min-width', '100%', 'important');
        elements.userProfileSVGWrapper.querySelector('mask rect').setAttribute('width', '500%');
        elements.userProfileSVGWrapper.removeAttribute('viewBox');

        // Flip profile panel outer wrapper, then flip inner wrapper back
        // This moves the webkit resize handle to the bottom left
        // Without affecting the elements inside
        elements.userProfile.style.setProperty('transform', 'scaleX(-1)', 'important');
        elements.innerUserProfile.style.setProperty('transform', 'scaleX(-1)', 'important');
        elements.userProfileFooter.style.setProperty('transform', 'scaleX(-1)', 'important');

        document.body.addEventListener('mousedown', () => {
          elements.userProfile.style.setProperty('transition', 'none', 'important');
        }, { signal: runtime.events.signal });

        if (elements.fullscreenButton) {
          elements.fullscreenButton.addEventListener('click', () => {
            if (document.fullscreenElement !== null)
              elements.userProfile.style.setProperty('max-width', '80vw', 'important');
            else
              elements.userProfile.style.setProperty('max-width', '0px', 'important');
          }, { signal: runtime.events.signal });
        }

        elements.userProfile.addEventListener('contextmenu', (e) => {
          if (e.target !== e.currentTarget)
            return;
          try {
            runtime.observers.resize.userProfile.disconnect();
          }
          catch {}
          settings.profilePanelWidth = 0;
          runtime.api.Data.save('profile-panel-width', settings.profilePanelWidth);
          elements.userProfile.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
          elements.userProfile.style.setProperty('width', 'var(--cui-profile-width)', 'important');
          try {
            runtime.observers.resize.userProfile.observe(elements.userProfile, { attributeFilter: ['style'] });
          }
          catch {}
          e.preventDefault();
        }, { signal: runtime.events.signal });

        runtime.observers.resize.userProfile = new MutationObserver((mutationList) => {
          try {
            if (((!runtime.collapsed[constants.I_USER_PROFILE])
              || (runtime.api.Data.load('user-profile-button-active')))
              && document.fullscreenElement === null) {
              var oldProfilePanelWidth = settings.profilePanelWidth;
              if (parseInt(elements.userProfile.style.width)) {
                settings.profilePanelWidth = parseInt(elements.userProfile.style.width);
                elements.userProfile.style
                  .setProperty('width', settings.profilePanelWidth + 'px', 'important');
              }
              else if (settings.profilePanelWidth !== 0) {
                elements.userProfile.style.setProperty('transition', 'none', 'important');
                elements.userProfile.style
                  .setProperty('width', settings.profilePanelWidth + 'px', 'important');
                elements.userProfile.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
              }
              if (oldProfilePanelWidth !== settings.profilePanelWidth)
                runtime.api.Data.save('profile-panel-width', settings.profilePanelWidth);
            }
          }
          catch (e) {
            console.warn('%c[CollapsibleUI] ' + '%cFailed to trigger mutationObserver width update! (see below)',
              'color: #3a71c1; font-weight: 700;', '');
            console.warn(e);
          }
        });
        runtime.observers.resize.userProfile.observe(elements.userProfile, { attributeFilter: ['style'] });
      }
      if (((!runtime.collapsed[constants.I_USER_PROFILE])
        || (runtime.api.Data.load('user-profile-button-active')))
        && settings.profilePanelWidth !== 0) {
        elements.userProfile.style.setProperty('transition', 'none', 'important');
        elements.userProfile.style.setProperty('width', settings.profilePanelWidth + 'px', 'important');
      }

      elements.userProfile.style.setProperty('transition', 'none', 'important');
    }

    if (elements.searchPanel) {
      // Handle resizing search panel
      if (settings.resizableSearchPanel) {
        elements.searchPanel.style.setProperty('resize', 'horizontal', 'important');
        elements.searchPanel.style.setProperty('max-width', '80vw', 'important');
        elements.searchPanel.style.setProperty('min-width', '0', 'important');

        // Flip search panel outer wrapper, then flip inner elements back
        // This moves the webkit resize handle to the bottom left
        // Without affecting the elements inside
        elements.searchPanel.style.setProperty('transform', 'scaleX(-1)', 'important');
        elements.searchPanel.childNodes.forEach((node) => {
          node.style.setProperty('transform', 'scaleX(-1)', 'important');
        });

        document.body.addEventListener('mousedown', () => {
          elements.searchPanel.style.setProperty('transition', 'none', 'important');
        }, { signal: runtime.events.signal });

        elements.searchPanel.addEventListener('contextmenu', (e) => {
          if (e.target !== e.currentTarget)
            return;
          try {
            runtime.observers.resize.searchPanel.disconnect();
          }
          catch {}
          settings.searchPanelWidth = 0;
          runtime.api.Data.save('search-panel-width', settings.searchPanelWidth);
          elements.searchPanel.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
          elements.searchPanel.style.setProperty('width', 'var(--cui-search-width)', 'important');
          try {
            runtime.observers.resize.searchPanel.observe(elements.searchPanel, { attributeFilter: ['style'] });
          }
          catch {}
          e.preventDefault();
        }, { signal: runtime.events.signal });

        runtime.observers.resize.searchPanel = new MutationObserver((mutationList) => {
          try {
            var oldSearchPanelWidth = settings.searchPanelWidth;
            if (parseInt(elements.searchPanel.style.width)) {
              settings.searchPanelWidth = parseInt(elements.searchPanel.style.width);
              elements.searchPanel.style
                .setProperty('width', settings.searchPanelWidth + 'px', 'important');
            }
            else if (settings.searchPanelWidth !== 0) {
              elements.searchPanel.style
                .setProperty('width', settings.searchPanelWidth + 'px', 'important');
            }
            if (oldSearchPanelWidth !== settings.searchPanelWidth)
              runtime.api.Data.save('search-panel-width', settings.searchPanelWidth);
          }
          catch (e) {
            console.warn('%c[CollapsibleUI] ' + '%cFailed to trigger mutationObserver width update! (see below)',
              'color: #3a71c1; font-weight: 700;', '');
            console.warn(e);
          }
        });
        runtime.observers.resize.searchPanel.observe(elements.searchPanel, { attributeFilter: ['style'] });
      }
      if (settings.searchPanelWidth !== 0) {
        elements.searchPanel.style.setProperty('width', settings.searchPanelWidth + 'px', 'important');
      }
    }

    if (elements.forumPopout) {
      // Handle resizing forum popout
      if (settings.resizableForumPopout) {
        elements.forumPopout.style.setProperty('resize', 'horizontal', 'important');
        elements.forumPopout.style.setProperty('max-width', '80vw', 'important');
        elements.forumPopout.style.setProperty('min-width', '0', 'important');

        // Flip forum popout outer wrapper, then flip inner elements back
        // This moves the webkit resize handle to the bottom left
        // Without affecting the elements inside
        elements.forumPopout.style.setProperty('transform', 'scaleX(-1)', 'important');
        elements.forumPopout.childNodes.forEach((node) => {
          node.style.setProperty('transform', 'scaleX(-1)', 'important');
        });

        document.body.addEventListener('mousedown', () => {
          elements.forumPopout.style.setProperty('transition', 'none', 'important');
          elements.forumPopoutTarget.style.setProperty('transition', 'none', 'important');
        }, { signal: runtime.events.signal });

        elements.forumPopout.addEventListener('contextmenu', (e) => {
          if (e.target !== e.currentTarget)
            return;
          try {
            runtime.observers.resize.forumPopout.disconnect();
          }
          catch {}
          settings.forumPopoutWidth = 0;
          runtime.api.Data.save('forum-popout-width', settings.forumPopoutWidth);
          elements.forumPopout.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
          elements.forumPopoutTarget.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
          elements.forumPopout.style.setProperty('width', 'var(--cui-popout-width)', 'important');
          elements.forumPopoutTarget.style.setProperty('width', 'var(--cui-popout-width)', 'important');
          try {
            runtime.observers.resize.forumPopout.observe(elements.forumPopout, { attributeFilter: ['style'] });
          }
          catch {}
          e.preventDefault();
        }, { signal: runtime.events.signal });

        runtime.observers.resize.forumPopout = new MutationObserver((mutationList) => {
          try {
            var oldForumPopoutWidth = settings.forumPopoutWidth;
            if (parseInt(elements.forumPopout.style.width)) {
              settings.forumPopoutWidth = parseInt(elements.forumPopout.style.width);
              elements.forumPopout.style.setProperty('width',
                settings.forumPopoutWidth + 'px', 'important');
              elements.forumPopoutTarget.style.setProperty('width',
                settings.forumPopoutWidth + 'px', 'important');
            }
            else if (settings.forumPopoutWidth !== 0) {
              elements.forumPopout.style.setProperty('width',
                settings.forumPopoutWidth + 'px', 'important');
              elements.forumPopoutTarget.style.setProperty('width',
                settings.forumPopoutWidth + 'px', 'important');
            }
            if (oldForumPopoutWidth !== settings.forumPopoutWidth)
              runtime.api.Data.save('forum-popout-width', settings.forumPopoutWidth);
          }
          catch (e) {
            console.warn('%c[CollapsibleUI] ' + '%cFailed to trigger mutationObserver width update! (see below)',
              'color: #3a71c1; font-weight: 700;', '');
            console.warn(e);
          }
        });
        runtime.observers.resize.forumPopout.observe(elements.forumPopout, { attributeFilter: ['style'] });
      }

      document.querySelector('.' + modules.threads?.container).style
        .setProperty('max-width', '100%', 'important');

      if (settings.forumPopoutWidth !== 0) {
        elements.forumPopout.style.setProperty('width', settings.forumPopoutWidth + 'px', 'important');
        elements.forumPopoutTarget.style.setProperty('width', settings.forumPopoutWidth + 'px', 'important');
      }
    }

    if (elements.messageInput)
      elements.messageInput.style
        .setProperty('transition', 'max-height ' + settings.transitionSpeed + 'ms', 'important');

    if (elements.userArea)
      elements.userArea.style
        .setProperty('transition', 'max-height ' + settings.transitionSpeed + 'ms', 'important');

    if (elements.callContainer()) {
      elements.callContainer().style.transition = 'max-height ' + settings.transitionSpeed + 'ms';
      window.addEventListener('resize', (e) => {
        try {
          if (elements.callContainer().style.maxHeight !== '0px') {
            elements.callContainer().style.setProperty('max-height',
              (window.outerHeight * 2) + 'px', 'important');
          }
        }
        catch {}
      }, { signal: runtime.events.signal });
    }

    if (elements.appBase) {
      if (runtime.themes.darkMatter)
        elements.appBase.style.transition = 'top ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
      else
        elements.appBase.style
          .setProperty('transition', 'top ' + settings.transitionSpeed + 'ms', 'important');
    }

    if (runtime.themes.darkMatter)
      elements.settingsContainerBase.style.transition = 'width ' + settings.transitionSpeed + 'ms, left ' + settings.transitionSpeed + 'ms';
  };

  // Checks if cursor is near an element
  isNear = (element, distance, x, y) => {
    try {
      if (runtime.themes.horizontalServerList && (element === elements.serverList)) {
        var top = 0,
          left = element.getBoundingClientRect().left - distance,
          right = left + element.getBoundingClientRect().width + 2 * distance,
          bottom = parseInt(runtime.api.Data.load('window-bar-height'))
              + element.getBoundingClientRect().height + distance;
      }
      else {
        var top = element.getBoundingClientRect().top - distance,
          left = element.getBoundingClientRect().left - distance,
          right = left + element.getBoundingClientRect().width + 2 * distance,
          bottom = top + element.getBoundingClientRect().height + 2 * distance;
      }
    }
    catch {
      var left = -1000,
        top = -1000,
        right = -1000,
        bottom = -1000;
    }
    return (x > left && x < right && y > top && y < bottom);
  };

  // Updates UI for dynamic uncollapse
  tickExpandOnHover = (settingsButtons, buttonsActive, singleButtonWidth) => {
    var _this = this; // Abstract CollapsibleUI as a variable

    // Toolbar
    if (settings.collapseToolbar === 'all') {
      if (!this.isNear(elements.toolbar, settings.buttonCollapseFudgeFactor, runtime.mouse.x, runtime.mouse.y))

        elements.toolbar.style.setProperty('max-width', singleButtonWidth, 'important');
    }

    // Toolbar Container
    if (settings.collapseToolbar) {
      if (!this.isNear(elements.toolbarContainer, settings.buttonCollapseFudgeFactor, runtime.mouse.x, runtime.mouse.y))

        this.collapseToolbarIcons(buttonsActive);
    }

    // Settings Container
    if (settings.collapseSettings) {
      if (!this.isNear(elements.settingsContainer, settings.buttonCollapseFudgeFactor, runtime.mouse.x, runtime.mouse.y)) {
        for (var i = 0; i < (settingsButtons.length - 1); i++) {
          settingsButtons[i].style.setProperty('max-width', '0px', 'important');
        }
      }
    }

    // Message Bar Button Container
    if ((settings.messageInputCollapse) && elements.messageInputButtonContainer) {
      if (!this.isNear(elements.messageInputButtonContainer, settings.buttonCollapseFudgeFactor, runtime.mouse.x, runtime.mouse.y))
        elements.messageInputButtonContainer.style.setProperty('max-width', settings.messageInputButtonsCollapsedWidth + 'px', 'important');
    }

    // Server List
    if ((!runtime.api.Data.load('server-list-button-active')) && elements.serverList) {
      this.floatElement(constants.I_SERVER_LIST, true);
      if (settings.expandOnHoverEnabled[constants.I_SERVER_LIST]
        && runtime.collapsed[constants.I_SERVER_LIST]
        && this.isNear(elements.serverList, settings.expandOnHoverOpeningFudgeFactor, runtime.mouse.x, runtime.mouse.y)
        && !(this.isNear(elements.messageInput, 0, runtime.mouse.x, runtime.mouse.y))) {
        if (runtime.delays[constants.I_SERVER_LIST]) {
          clearTimeout(runtime.delays[constants.I_SERVER_LIST]);
          runtime.delays[constants.I_SERVER_LIST] = false;
        }
        runtime.delays[constants.I_SERVER_LIST] = setTimeout(() => {
          elements.serverList.style.removeProperty('width');
          if (runtime.themes.horizontalServerList)
            elements.appBase.style.removeProperty('top');
          else if (runtime.themes.darkMatter) {
            elements.settingsContainerBase.style.setProperty('width', 'calc(100% + 72px)', 'important');
            elements.settingsContainerBase.style.setProperty('left', '-72px', 'important');
            elements.appBase.style.setProperty('min-width', 'calc(100vw - 72px)', 'important');
          }
          runtime.collapsed[constants.I_SERVER_LIST] = false;
          runtime.delays[constants.I_SERVER_LIST] = false;
        }, settings.expandOnHoverDelay);
      }
      else if (!settings.expandOnHoverEnabled[constants.I_SERVER_LIST]
        || ((!(runtime.collapsed[constants.I_SERVER_LIST]) || runtime.delays[constants.I_SERVER_LIST])
        && !(this.isNear(elements.serverList, settings.expandOnHoverClosingFudgeFactor, runtime.mouse.x, runtime.mouse.y)))) {
        if (runtime.delays[constants.I_SERVER_LIST]) {
          clearTimeout(runtime.delays[constants.I_SERVER_LIST]);
          runtime.delays[constants.I_SERVER_LIST] = false;
        }

        elements.serverList.style.setProperty('width', settings.collapseSize + 'px', 'important');
        if (runtime.themes.horizontalServerList)
          elements.appBase.style.setProperty('top', '0px', 'important');
        if (runtime.themes.darkMatter) {
          elements.settingsContainerBase.style.setProperty('width', '100%', 'important');
          elements.settingsContainerBase.style.setProperty('left', '0px', 'important');
          elements.appBase.style.setProperty('min-width', '100vw', 'important');
        }
        runtime.collapsed[constants.I_SERVER_LIST] = true;
      }
    }

    // Channel List
    if ((!runtime.api.Data.load('channel-list-button-active')) && elements.channelList) {
      this.floatElement(constants.I_CHANNEL_LIST, true);
      if (settings.expandOnHoverEnabled[constants.I_CHANNEL_LIST]
        && runtime.collapsed[constants.I_CHANNEL_LIST]
        && this.isNear(elements.channelList, settings.expandOnHoverOpeningFudgeFactor, runtime.mouse.x, runtime.mouse.y)
        && !(this.isNear(elements.messageInput, 0, runtime.mouse.x, runtime.mouse.y))) {
        if (runtime.delays[constants.I_CHANNEL_LIST]) {
          clearTimeout(runtime.delays[constants.I_CHANNEL_LIST]);
          runtime.delays[constants.I_CHANNEL_LIST] = false;
        }
        runtime.delays[constants.I_CHANNEL_LIST] = setTimeout(() => {
          elements.channelList.style.transition = 'width ' + settings.transitionSpeed + 'ms';
          elements.channelList.style.removeProperty('width');
          if (runtime.themes.darkMatter) {
            elements.settingsContainer.style.removeProperty('display');
            if (elements.spotifyContainer)
              elements.spotifyContainer.style.removeProperty('display');
          }
          runtime.collapsed[constants.I_CHANNEL_LIST] = false;
          runtime.delays[constants.I_CHANNEL_LIST] = false;
        }, settings.expandOnHoverDelay);
      }
      else if (!settings.expandOnHoverEnabled[constants.I_CHANNEL_LIST]
        || (!(runtime.collapsed[constants.I_CHANNEL_LIST])
        && !(this.isNear(elements.channelList, settings.expandOnHoverClosingFudgeFactor, runtime.mouse.x, runtime.mouse.y)))) {
        if (runtime.delays[constants.I_CHANNEL_LIST]) {
          clearTimeout(runtime.delays[constants.I_CHANNEL_LIST]);
          runtime.delays[constants.I_CHANNEL_LIST] = false;
        }
        elements.channelList.style.transition = 'width ' + settings.transitionSpeed + 'ms';
        elements.channelList.style.setProperty('width', settings.collapseSize + 'px', 'important');
        if (runtime.themes.darkMatter) {
          elements.settingsContainer.style.setProperty('display', 'none', 'important');
          if (elements.spotifyContainer)
            elements.spotifyContainer.style.setProperty('display', 'none', 'important');
        }
        runtime.collapsed[constants.I_CHANNEL_LIST] = true;
      }
    }

    // Message Bar
    if ((!runtime.api.Data.load('message-input-button-active')) && elements.messageInput) {
      if (settings.expandOnHoverEnabled[constants.I_MESSAGE_INPUT]
        && runtime.collapsed[constants.I_MESSAGE_INPUT]
        && this.isNear(elements.messageInput, settings.expandOnHoverOpeningFudgeFactor, runtime.mouse.x, runtime.mouse.y)) {
        if (runtime.delays[constants.I_MESSAGE_INPUT]) {
          clearTimeout(runtime.delays[constants.I_MESSAGE_INPUT]);
          runtime.delays[constants.I_MESSAGE_INPUT] = false;
        }
        runtime.delays[constants.I_MESSAGE_INPUT] = setTimeout(() => {
          elements.messageInput.style.setProperty('max-height', settings.messageInputMaxHeight + 'px', 'important');
          elements.messageInput.style.removeProperty('overflow');
          runtime.collapsed[constants.I_MESSAGE_INPUT] = false;
          runtime.delays[constants.I_MESSAGE_INPUT] = false;
        }, settings.expandOnHoverDelay);
      }
      else if (!settings.expandOnHoverEnabled[constants.I_MESSAGE_INPUT]
        || (!(runtime.collapsed[constants.I_MESSAGE_INPUT])
        && !(this.isNear(elements.messageInput, settings.expandOnHoverClosingFudgeFactor, runtime.mouse.x, runtime.mouse.y))
        && !(document.querySelector('[data-slate-string="true"]')?.innerHTML)
        && !(document.querySelector('.' + modules.attachments?.channelAttachmentArea))
        && !(document.querySelector('.' + modules.input?.expressionPickerPositionLayer))
        && !(document.querySelector('#channel-attach')))) {
        if (runtime.delays[constants.I_MESSAGE_INPUT]) {
          clearTimeout(runtime.delays[constants.I_MESSAGE_INPUT]);
          runtime.delays[constants.I_MESSAGE_INPUT] = false;
        }
        elements.messageInput.style.setProperty('max-height', settings.collapseSize + 'px', 'important');
        elements.messageInput.style.setProperty('overflow', 'hidden', 'important');
        runtime.collapsed[constants.I_MESSAGE_INPUT] = true;
      }
    }

    // Window Bar
    if ((!runtime.api.Data.load('window-bar-button-active')) && elements.windowBar) {
      if (settings.expandOnHoverEnabled[constants.I_WINDOW_BAR]
        && runtime.collapsed[constants.I_WINDOW_BAR]
        && this.isNear(elements.windowBar, settings.expandOnHoverOpeningFudgeFactor, runtime.mouse.x, runtime.mouse.y)) {
        if (runtime.delays[constants.I_WINDOW_BAR]) {
          clearTimeout(runtime.delays[constants.I_WINDOW_BAR]);
          runtime.delays[constants.I_WINDOW_BAR] = false;
        }
        runtime.delays[constants.I_WINDOW_BAR] = setTimeout(() => {
          if (runtime.themes.darkMatter) {
            elements.windowBar.style.setProperty('height', '26px', 'important');
            elements.windowBar.style.removeProperty('opacity');
          }
          else
            elements.windowBar.style.setProperty('height', settings.windowBarHeight + 'px', 'important');
          elements.windowBar.style.removeProperty('padding');
          elements.windowBar.style.removeProperty('margin');
          elements.wordMark?.style.removeProperty('display');
          elements.windowBar.style.removeProperty('overflow');
          runtime.collapsed[constants.I_WINDOW_BAR] = false;
          runtime.delays[constants.I_WINDOW_BAR] = false;
        }, settings.expandOnHoverDelay);
      }
      else if (!settings.expandOnHoverEnabled[constants.I_WINDOW_BAR]
        || (!(runtime.collapsed[constants.I_WINDOW_BAR])
        && !(this.isNear(elements.windowBar, settings.expandOnHoverClosingFudgeFactor, runtime.mouse.x, runtime.mouse.y)))) {
        if (runtime.delays[constants.I_WINDOW_BAR]) {
          clearTimeout(runtime.delays[constants.I_WINDOW_BAR]);
          runtime.delays[constants.I_WINDOW_BAR] = false;
        }
        elements.windowBar.style.setProperty('height', '0px', 'important');
        if (runtime.themes.darkMatter)
          elements.windowBar.style.setProperty('opacity', '0', 'important');
        elements.windowBar.style.setProperty('padding', '0px', 'important');
        elements.windowBar.style.setProperty('margin', '0px', 'important');
        elements.windowBar.style.setProperty('overflow', 'hidden', 'important');
        elements.wordMark?.style.setProperty('display', 'none', 'important');
        runtime.collapsed[constants.I_WINDOW_BAR] = true;
      }
    }

    // Members List
    if ((!runtime.api.Data.load('members-list-button-active')) && elements.membersList) {
      this.floatElement(constants.I_MEMBERS_LIST, true);
      if (settings.expandOnHoverEnabled[constants.I_MEMBERS_LIST]
        && runtime.collapsed[constants.I_MEMBERS_LIST]
        && this.isNear(elements.membersList, settings.expandOnHoverOpeningFudgeFactor, runtime.mouse.x, runtime.mouse.y)
        && !(this.isNear(elements.messageInput, 0, runtime.mouse.x, runtime.mouse.y))) {
        if (runtime.delays[constants.I_MEMBERS_LIST]) {
          clearTimeout(runtime.delays[constants.I_MEMBERS_LIST]);
          runtime.delays[constants.I_MEMBERS_LIST] = false;
        }
        runtime.delays[constants.I_MEMBERS_LIST] = setTimeout(() => {
          elements.membersList.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
          elements.contentWindow.style
            .setProperty('transition', 'max-width ' + settings.transitionSpeed + 'ms', 'important');
          if (settings.membersListWidth !== 0) {
            elements.membersList.style
              .setProperty('width', settings.membersListWidth + 'px', 'important');
            elements.membersList.style
              .setProperty('min-width', settings.membersListWidth + 'px', 'important');
            if (!settings.floatingPanels)
              elements.contentWindow.style
                .setProperty('max-width', 'calc(100% - ' + settings.membersListWidth + 'px)', 'important');
            else
              elements.contentWindow.style
                .setProperty('max-width', '100%', 'important');
          }
          else {
            elements.membersList.style
              .setProperty('width', 'var(--cui-members-width)', 'important');
            elements.membersList.style
              .setProperty('min-width', 'var(--cui-members-width)', 'important');
            if (!settings.floatingPanels)
              elements.contentWindow.style
                .setProperty('max-width', 'calc(100% - var(--cui-members-width))', 'important');
            else
              elements.contentWindow.style.setProperty('max-width', '100%', 'important');
          }
          runtime.collapsed[constants.I_MEMBERS_LIST] = false;
          runtime.delays[constants.I_MEMBERS_LIST] = false;
        }, settings.expandOnHoverDelay);
      }
      else if (!settings.expandOnHoverEnabled[constants.I_MEMBERS_LIST]
        || (!(runtime.collapsed[constants.I_MEMBERS_LIST])
        && !(this.isNear(elements.membersList, settings.expandOnHoverClosingFudgeFactor, runtime.mouse.x, runtime.mouse.y))
        && !(this.isNear(document.querySelector('.' + modules.panel?.outer + '.' + modules.panel?.panel), 10000, runtime.mouse.x, runtime.mouse.y)))) {
        if (runtime.delays[constants.I_MEMBERS_LIST]) {
          clearTimeout(runtime.delays[constants.I_MEMBERS_LIST]);
          runtime.delays[constants.I_MEMBERS_LIST] = false;
        }
        elements.membersList.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
        elements.contentWindow.style
          .setProperty('transition', 'max-width ' + settings.transitionSpeed + 'ms', 'important');
        elements.membersList.style.setProperty('width', settings.collapseSize + 'px', 'important');
        elements.membersList.style.setProperty('min-width', settings.collapseSize + 'px', 'important');
        if (!settings.floatingPanels)
          elements.contentWindow.style
            .setProperty('max-width', 'calc(100% - ' + settings.collapseSize + 'px)', 'important');
        else
          elements.contentWindow.style.setProperty('max-width', '100%', 'important');
        runtime.collapsed[constants.I_MEMBERS_LIST] = true;
      }
    }

    // Profile Panel
    if ((!runtime.api.Data.load('user-profile-button-active')) && elements.userProfile) {
      this.floatElement(constants.I_USER_PROFILE, true);
      if (settings.expandOnHoverEnabled[constants.I_USER_PROFILE]
        && runtime.collapsed[constants.I_USER_PROFILE]
        && this.isNear(elements.userProfile, settings.expandOnHoverOpeningFudgeFactor, runtime.mouse.x, runtime.mouse.y)
        && !(this.isNear(elements.messageInput, 0, runtime.mouse.x, runtime.mouse.y))) {
        if (runtime.delays[constants.I_USER_PROFILE]) {
          clearTimeout(runtime.delays[constants.I_USER_PROFILE]);
          runtime.delays[constants.I_USER_PROFILE] = false;
        }
        runtime.delays[constants.I_USER_PROFILE] = setTimeout(() => {
          elements.userProfile.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
          if (settings.profilePanelWidth !== 0)
            elements.userProfile.style.setProperty('width', settings.profilePanelWidth + 'px', 'important');
          else
            elements.userProfile.style.setProperty('width', 'var(--cui-profile-width)', 'important');
          runtime.collapsed[constants.I_USER_PROFILE] = false;
          runtime.delays[constants.I_USER_PROFILE] = false;
        }, settings.expandOnHoverDelay);
      }
      else if (!settings.expandOnHoverEnabled[constants.I_USER_PROFILE]
        || (!(runtime.collapsed[constants.I_USER_PROFILE])
        && !(this.isNear(elements.userProfile, settings.expandOnHoverClosingFudgeFactor, runtime.mouse.x, runtime.mouse.y))
        && !(this.isNear(document.querySelector('.' + modules.members?.membersWrap), 10000, runtime.mouse.x, runtime.mouse.y)))) {
        if (runtime.delays[constants.I_USER_PROFILE]) {
          clearTimeout(runtime.delays[constants.I_USER_PROFILE]);
          runtime.delays[constants.I_USER_PROFILE] = false;
        }
        elements.userProfile.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
        elements.userProfile.style.setProperty('width', settings.collapseSize + 'px', 'important');
        runtime.collapsed[constants.I_USER_PROFILE] = true;
      }
    }

    // User Area
    if ((!runtime.api.Data.load('user-area-button-active')) && elements.userArea) {
      if (settings.expandOnHoverEnabled[constants.I_USER_AREA]
        && runtime.collapsed[constants.I_USER_AREA]
        && this.isNear(elements.userArea, settings.expandOnHoverOpeningFudgeFactor, runtime.mouse.x, runtime.mouse.y)) {
        if (runtime.delays[constants.I_USER_AREA]) {
          clearTimeout(runtime.delays[constants.I_USER_AREA]);
          runtime.delays[constants.I_USER_AREA] = false;
        }
        runtime.delays[constants.I_USER_AREA] = setTimeout(() => {
          elements.userArea.style.setProperty('max-height', settings.userAreaMaxHeight + 'px', 'important');
          runtime.collapsed[constants.I_USER_AREA] = false;
          runtime.delays[constants.I_USER_AREA] = false;
        }, settings.expandOnHoverDelay);
      }
      else if (!settings.expandOnHoverEnabled[constants.I_USER_AREA]
        || (!(runtime.collapsed[constants.I_USER_AREA])
        && !(this.isNear(elements.userArea, settings.expandOnHoverClosingFudgeFactor, runtime.mouse.x, runtime.mouse.y)))) {
        if (runtime.delays[constants.I_USER_AREA]) {
          clearTimeout(runtime.delays[constants.I_USER_AREA]);
          runtime.delays[constants.I_USER_AREA] = false;
        }
        elements.userArea.style.setProperty('max-height', settings.collapseSize + 'px', 'important');
        runtime.collapsed[constants.I_USER_AREA] = true;
      }
    }

    // Call Container
    if ((!runtime.api.Data.load('call-window-button-active'))
      && elements.callContainer()) {
      if (settings.expandOnHoverEnabled[constants.I_CALL_WINDOW]
        && runtime.collapsed[constants.I_CALL_WINDOW]
        && this.isNear(elements.callContainer(), settings.expandOnHoverOpeningFudgeFactor, runtime.mouse.x, runtime.mouse.y)) {
        if (runtime.delays[constants.I_CALL_WINDOW]) {
          clearTimeout(runtime.delays[constants.I_CALL_WINDOW]);
          runtime.delays[constants.I_CALL_WINDOW] = false;
        }
        runtime.delays[constants.I_CALL_WINDOW] = setTimeout(() => {
          elements.callContainer().style.setProperty('max-height',
            (window.outerHeight - 222) + 'px', 'important');
          if (document.querySelector('.' + modules.callMembers?.voiceCallWrapper))
            document.querySelector('.' + modules.callMembers?.voiceCallWrapper).style
              .removeProperty('display');
          runtime.collapsed[constants.I_CALL_WINDOW] = false;
          runtime.delays[constants.I_CALL_WINDOW] = false;
        }, settings.expandOnHoverDelay);
      }
      else if (!settings.expandOnHoverEnabled[constants.I_CALL_WINDOW]
        || (!(runtime.collapsed[constants.I_CALL_WINDOW])
        && !(this.isNear(elements.callContainer(), settings.expandOnHoverClosingFudgeFactor, runtime.mouse.x, runtime.mouse.y)))) {
        if (runtime.delays[constants.I_CALL_WINDOW]) {
          clearTimeout(runtime.delays[constants.I_CALL_WINDOW]);
          runtime.delays[constants.I_CALL_WINDOW] = false;
        }
        elements.callContainer().style.setProperty('max-height', '0px', 'important');
        if (document.querySelector('.' + modules.callMembers?.voiceCallWrapper))
          document.querySelector('.' + modules.callMembers?.voiceCallWrapper).style
            .setProperty('display', 'none', 'important');
        runtime.collapsed[constants.I_CALL_WINDOW] = true;
      }
    }
  };

  // Toggles a button at the specified index
  toggleButton = (index) => {
    switch (index) {
      case 0: // constants.I_SERVER_LIST
        this.floatElement(constants.I_SERVER_LIST, false);
        if (runtime.api.Data.load('server-list-button-active')) {
          elements.serverList.style
            .setProperty('width', settings.collapseSize + 'px', 'important');
          if (runtime.themes.darkMatter) {
            elements.settingsContainerBase.style.setProperty('width', '100%', 'important');
            elements.settingsContainerBase.style.setProperty('left', '0px', 'important');
            elements.appBase.style.setProperty('min-width', '100vw', 'important');
          }
          if (runtime.themes.horizontalServerList) {
            elements.appBase.style.setProperty('top', '0px', 'important');
          }
          runtime.api.Data.save('server-list-button-active', false);
          runtime.buttons[constants.I_SERVER_LIST].classList.remove(modules.icons?.selected);
        }
        else {
          elements.serverList.style.removeProperty('width');
          if ((!runtime.themes.horizontalServerList) && runtime.themes.darkMatter) {
            elements.settingsContainerBase.style
              .setProperty('width', 'calc(100% + 72px)', 'important');
            elements.settingsContainerBase.style
              .setProperty('left', '-72px', 'important');
            elements.appBase.style
              .setProperty('min-width', 'calc(100vw - 72px)', 'important');
          }
          if (runtime.themes.horizontalServerList) {
            elements.appBase.style.removeProperty('top');
          }
          runtime.api.Data.save('server-list-button-active', true);
          runtime.buttons[constants.I_SERVER_LIST].classList.add(modules.icons?.selected);
        }
        break;

      case 1: // constants.I_CHANNEL_LIST
        this.floatElement(constants.I_CHANNEL_LIST, false);
        if (runtime.api.Data.load('channel-list-button-active')) {
          elements.channelList.style.transition = 'width ' + settings.transitionSpeed + 'ms';
          elements.channelList.style
            .setProperty('width', settings.collapseSize + 'px', 'important');
          if (runtime.themes.darkMatter) {
            elements.settingsContainer.style.setProperty('display', 'none', 'important');
            if (elements.spotifyContainer)
              elements.spotifyContainer.style.setProperty('display', 'none', 'important');
          }
          runtime.api.Data.save('channel-list-button-active', false);
          runtime.buttons[constants.I_CHANNEL_LIST].classList.remove(modules.icons?.selected);
        }
        else {
          elements.channelList.style.transition = 'width ' + settings.transitionSpeed + 'ms';
          elements.channelList.style.removeProperty('width');
          if (runtime.themes.darkMatter) {
            elements.settingsContainer.style.removeProperty('display');
            if (elements.spotifyContainer)
              elements.spotifyContainer.style.removeProperty('display');
          }
          runtime.api.Data.save('channel-list-button-active', true);
          runtime.buttons[constants.I_CHANNEL_LIST].classList.add(modules.icons?.selected);
        }
        break;

      case 2: // constants.I_MEMBERS_LIST
        this.floatElement(constants.I_MEMBERS_LIST, false);
        if (runtime.api.Data.load('members-list-button-active')) {
          elements.membersList.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
          elements.contentWindow.style
            .setProperty('transition', 'max-width ' + settings.transitionSpeed + 'ms', 'important');
          elements.membersList.style
            .setProperty('width', settings.collapseSize + 'px', 'important');
          elements.membersList.style
            .setProperty('min-width', settings.collapseSize + 'px', 'important');
          elements.contentWindow.style
            .setProperty('max-width', 'calc(100% - ' + settings.collapseSize + 'px)', 'important');
          runtime.api.Data.save('members-list-button-active', false);
          runtime.buttons[constants.I_MEMBERS_LIST].classList.remove(modules.icons?.selected);
        }
        else {
          elements.membersList.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
          elements.contentWindow.style
            .setProperty('transition', 'max-width ' + settings.transitionSpeed + 'ms', 'important');
          if (settings.membersListWidth !== 0) {
            elements.membersList.style
              .setProperty('width', settings.membersListWidth + 'px', 'important');
            elements.membersList.style
              .setProperty('min-width', settings.membersListWidth + 'px', 'important');
            elements.contentWindow.style
              .setProperty('max-width', 'calc(100% - ' + settings.membersListWidth + 'px)', 'important');
          }
          else {
            elements.membersList.style
              .setProperty('width', 'var(--cui-members-width)', 'important');
            elements.membersList.style
              .setProperty('min-width', 'var(--cui-members-width)', 'important');
            elements.contentWindow.style
              .setProperty('max-width', 'calc(100% - var(--cui-members-width))', 'important');
          }
          runtime.api.Data.save('members-list-button-active', true);
          runtime.buttons[constants.I_MEMBERS_LIST].classList.add(modules.icons?.selected);
        }
        break;

      case 3: // constants.I_USER_PROFILE
        this.floatElement(constants.I_USER_PROFILE, false);
        if (runtime.api.Data.load('user-profile-button-active')) {
          elements.userProfile.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
          elements.userProfile.style.setProperty('width', settings.collapseSize + 'px', 'important');
          runtime.api.Data.save('user-profile-button-active', false);
          runtime.buttons[constants.I_USER_PROFILE].classList.remove(modules.icons?.selected);
        }
        else {
          elements.userProfile.style.transition = 'width ' + settings.transitionSpeed + 'ms, min-width ' + settings.transitionSpeed + 'ms';
          if (settings.profilePanelWidth !== 0)
            elements.userProfile.style.setProperty('width', settings.profilePanelWidth + 'px', 'important');
          else
            elements.userProfile.style.setProperty('width', 'var(--cui-profile-width)', 'important');
          runtime.api.Data.save('user-profile-button-active', true);
          runtime.buttons[constants.I_USER_PROFILE].classList.add(modules.icons?.selected);
        }
        break;

      case 4: // constants.I_MESSAGE_INPUT
        if (runtime.api.Data.load('message-input-button-active')) {
          if (!(document.querySelector('[data-slate-string="true"]')?.innerHTML)
            && !(document.querySelector('.' + modules.attachments?.channelAttachmentArea))
            && !(document.querySelector('.' + modules.input?.expressionPickerPositionLayer))
            && !(document.querySelector('#channel-attach'))) {
            elements.messageInput.style
              .setProperty('max-height', settings.collapseSize + 'px', 'important');
            elements.messageInput.style.setProperty('overflow', 'hidden', 'important');
          }
          runtime.api.Data.save('message-input-button-active', false);
          runtime.buttons[constants.I_MESSAGE_INPUT].classList.remove(modules.icons?.selected);
        }
        else {
          elements.messageInput.style
            .setProperty('max-height', settings.messageInputMaxHeight + 'px', 'important');
          elements.messageInput.style.removeProperty('overflow');
          runtime.api.Data.save('message-input-button-active', true);
          runtime.buttons[constants.I_MESSAGE_INPUT].classList.add(modules.icons?.selected);
        }
        break;

      case 5: // constants.I_WINDOW_BAR
        if (runtime.api.Data.load('window-bar-button-active')) {
          elements.windowBar.style.setProperty('height', '0px', 'important');
          if (runtime.themes.darkMatter)
            elements.windowBar.style.setProperty('opacity', '0', 'important');
          elements.windowBar.style.setProperty('padding', '0px', 'important');
          elements.windowBar.style.setProperty('margin', '0px', 'important');
          elements.windowBar.style.setProperty('overflow', 'hidden', 'important');
          elements.wordMark?.style.setProperty('display', 'none', 'important');
          runtime.api.Data.save('window-bar-button-active', false);
          runtime.buttons[constants.I_WINDOW_BAR].classList.remove(modules.icons?.selected);
        }
        else {
          if (runtime.themes.darkMatter) {
            elements.windowBar.style.setProperty('height', '26px', 'important');
            elements.windowBar.style.removeProperty('opacity');
          }
          else
            elements.windowBar.style
              .setProperty('height', settings.windowBarHeight + 'px', 'important');
          elements.windowBar.style.removeProperty('padding');
          elements.windowBar.style.removeProperty('margin');
          elements.windowBar.style.removeProperty('overflow');
          elements.wordMark?.style.removeProperty('display');
          runtime.api.Data.save('window-bar-button-active', true);
          runtime.buttons[constants.I_WINDOW_BAR].classList.add(modules.icons?.selected);
        }
        break;

      case 6: // constants.I_CALL_WINDOW
        if (runtime.api.Data.load('call-window-button-active')) {
          if (elements.callContainer()) {
            elements.callContainer().style.setProperty('max-height', '0px', 'important');
            if (document.querySelector('.' + modules.callMembers?.voiceCallWrapper))
              document.querySelector('.' + modules.callMembers?.voiceCallWrapper).style
                .setProperty('display', 'none', 'important');
          }
          runtime.api.Data.save('call-window-button-active', false);
          runtime.buttons[constants.I_CALL_WINDOW].classList.remove(modules.icons?.selected);
        }
        else {
          if (elements.callContainer()) {
            elements.callContainer().style.setProperty('max-height',
              (window.outerHeight - 222) + 'px', 'important');
            if (document.querySelector('.' + modules.callMembers?.voiceCallWrapper))
              document.querySelector('.' + modules.callMembers?.voiceCallWrapper).style
                .removeProperty('display');
          }
          runtime.api.Data.save('call-window-button-active', true);
          runtime.buttons[constants.I_CALL_WINDOW].classList.add(modules.icons?.selected);
        }
        break;

      case 7: // constants.I_USER_AREA
        if (runtime.api.Data.load('user-area-button-active')) {
          elements.userArea.style
            .setProperty('max-height', settings.collapseSize + 'px', 'important');
          runtime.api.Data.save('user-area-button-active', false);
          runtime.buttons[constants.I_USER_AREA].classList.remove(modules.icons?.selected);
        }
        else {
          elements.userArea
            .style.setProperty('max-height', settings.userAreaMaxHeight + 'px', 'important');
          runtime.api.Data.save('user-area-button-active', true);
          runtime.buttons[constants.I_USER_AREA].classList.add(modules.icons?.selected);
        }
        break;

      default:
        break;
    }
  };

  // Sends/clears a persistent notification for unread DMs
  updateDMBadge = (clear) => {
    if (elements.wordMark) {
      // Clear old notification if it exists
      document.querySelectorAll('.collapsible-ui-notif')
        .forEach(e => e.remove());
      elements.wordMark.style.removeProperty('margin-left');

      // Count DM notifications
      var dmNotifs = 0;
      document.querySelectorAll('.' + modules.badge?.numberBadge.split(' ')[0])
        .forEach(e => dmNotifs += parseInt(e.innerHTML));

      // Return if a new notification doesn't need to be created
      if (clear || (dmNotifs === 0)) return;

      // Create new notification
      var dmBadge = document.createElement('div');
      dmBadge.classList.add('collapsible-ui-element');
      dmBadge.classList.add('collapsible-ui-notif');
      dmBadge.classList.add(modules.badge?.numberBadge.split(' ')[0]);
      dmBadge.classList.add(modules.badge?.numberBadge.split(' ')[1]);
      dmBadge.classList.add(modules.badge?.numberBadge.split(' ')[2]);
      dmBadge.classList.add(modules.badge?.baseShapeRound);
      dmBadge.style.setProperty('background-color', 'var(--status-danger)', 'important');
      dmBadge.style.setProperty('padding', '4px', 'important');
      dmBadge.style.maxHeight = (elements.wordMark.getBoundingClientRect().height
      - 6) + 'px';
      dmBadge.style.setProperty('min-height', '0px', 'important');
      dmBadge.style.marginLeft = (parseInt(getComputedStyle(elements.wordMark, null)
        .getPropertyValue('padding-left')) * 2 / 3) + 'px';
      dmBadge.style.marginTop = getComputedStyle(elements.wordMark, null)
        .getPropertyValue('padding-top');
      dmBadge.style.setProperty('position', 'fixed', 'important');
      dmBadge.style.setProperty('z-index', '10000', 'important');
      dmBadge.innerHTML = `${dmNotifs}`;

      // Insert into document
      document.body.appendChild(dmBadge);

      // Display notification
      dmBadge.style.setProperty('left', elements.wordMark.getBoundingClientRect().left + 'px', 'important');
      dmBadge.style.setProperty('top', elements.wordMark.getBoundingClientRect().top + 'px', 'important');
      elements.wordMark.style.setProperty('margin-left', `${dmBadge.getBoundingClientRect().width}px`, 'important');
    }
  };
};
