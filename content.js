class GoogleMeetEmojiPicker {
  constructor() {
    this.emojiButton = null;
    this.emojiPicker = null;
    this.isPickerVisible = false;
    this.currentInput = null;
    this.initialized = false;
    this.sectionElements = new Map();
    
    this.init();
  }

  init() {
    this.waitForChatInput();
    this.setupKeyboardShortcut();
  }

  waitForChatInput() {
    const checkForChat = () => {
      if (this.initialized) return;
      
      const chatContainer = this.findChatContainer();
      if (chatContainer && !this.emojiButton) {
        console.log('Found chat container, creating emoji button');
        this.createEmojiButton(chatContainer);
        this.initialized = true;
      }
    };

    // Check immediately
    checkForChat();
    
    // Check every 2 seconds until found
    const interval = setInterval(() => {
      if (this.initialized) {
        clearInterval(interval);
        return;
      }
      checkForChat();
    }, 2000);
  }

  setupKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      // Check for Ctrl+Q (Windows/Linux) or Cmd+Q (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
        e.preventDefault();
        e.stopPropagation();
        
        const chatInput = this.findChatInput();
        if (chatInput) {
          this.toggleEmojiPicker(chatInput);
        }
      }
      
      // Close picker with Escape
      if (e.key === 'Escape' && this.isPickerVisible) {
        this.hideEmojiPicker();
      }
    });
  }

  findChatInput() {
    // Look for the specific Google Meet chat input
    const chatInput = document.querySelector('[aria-label="Send a message"], [aria-label="Type a message"]');
    if (chatInput && this.isVisible(chatInput)) {
      return chatInput;
    }
    return null;
  }

  findChatContainer() {
    // Look for the specific Google Meet chat input container
    const chatInput = document.querySelector('[aria-label="Send a message"], [aria-label="Type a message"]');
    if (!chatInput) return null;

    // Find the container that holds both the input and send button
    let container = chatInput.parentElement;
    
    // Look for a container that has the input and a button (send button)
    for (let i = 0; i < 5; i++) {
      if (!container) break;
      
      // Check if this container has both the input and a button
      const hasInput = container.contains(chatInput);
      const hasButton = container.querySelector('button, [role="button"]');
      
      if (hasInput && hasButton) {
        console.log('Found container with both input and button');
        return container;
      }
      
      container = container.parentElement;
    }

    // If not found, return the input's immediate parent
    return chatInput.parentElement;
  }

  isVisible(element) {
    return element.offsetWidth > 0 && element.offsetHeight > 0 && element.style.display !== 'none';
  }

  createEmojiButton(chatContainer) {
    // Remove any existing buttons first
    this.removeExistingButtons();
    
    // Create emoji button
    this.emojiButton = document.createElement('button');
    this.emojiButton.innerHTML = '😊';
    this.emojiButton.className = 'google-meet-emoji-button';
    this.emojiButton.type = 'button';
    this.emojiButton.title = 'Insert emoji (Ctrl+Q)';
    
    // Style the button to match Google Meet's design
    Object.assign(this.emojiButton.style, {
      background: 'transparent',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '4px',
      marginRight: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      flexShrink: '0'
    });

    this.emojiButton.addEventListener('mouseenter', () => {
      this.emojiButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });

    this.emojiButton.addEventListener('mouseleave', () => {
      this.emojiButton.style.backgroundColor = 'transparent';
    });

    this.emojiButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const chatInput = document.querySelector('[aria-label="Send a message"], [aria-label="Type a message"]');
      if (chatInput) {
        this.toggleEmojiPicker(chatInput);
      }
    });

    // Insert button at the beginning of the chat container
    this.insertButtonIntoContainer(chatContainer);
    
    // Create emoji picker
    this.createEmojiPicker();
  }

  removeExistingButtons() {
    const existingButtons = document.querySelectorAll('.google-meet-emoji-button');
    existingButtons.forEach(button => {
      button.remove();
    });
  }

  insertButtonIntoContainer(chatContainer) {
    console.log('Inserting button into container');
    
    // Make sure the container uses flexbox
    const containerStyle = getComputedStyle(chatContainer);
    if (containerStyle.display !== 'flex') {
      chatContainer.style.display = 'flex';
      chatContainer.style.alignItems = 'center';
      chatContainer.style.flexWrap = 'nowrap';
      chatContainer.style.gap = '8px';
    }
    
    // Insert the button at the very beginning
    chatContainer.insertBefore(this.emojiButton, chatContainer.firstChild);
    
    console.log('Button inserted successfully');
  }

  createEmojiPicker() {
    this.emojiPicker = document.createElement('div');
    this.emojiPicker.className = 'google-meet-emoji-picker';
    this.emojiPicker.style.cssText = `
      position: fixed;
      background: white;
      border: 1px solid #ddd;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      width: 340px;
      height: 380px;
      display: none;
      font-family: 'Segoe UI', system-ui, sans-serif;
      overflow: hidden;
    `;

    // All emojis organized by sections
    const emojiSections = {
      'Smileys & People': ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','☺️','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😶‍🌫️','😏','😒','🙄','😬','😮‍💨','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','😵‍💫','🤯','🤠','🥳','🥸','😎','🤓','🧐','😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖','😺','😸','😹','😻','😼','😽','🙀','😿','😾','👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🧠','🫀','🫁','🦷','🦴','👀','👁️','👅','👄','🫦','👶','🧒','👦','👧','🧑','👱','👨','🧔','🧔‍♂️','🧔‍♀️','👨‍🦰','👨‍🦱','👨‍🦳','👨‍🦲','👩','👩‍🦰','👩‍🦱','👩‍🦳','👩‍🦲','🧓','👴','👵','🙍','🙍‍♂️','🙍‍♀️','🙎','🙎‍♂️','🙎‍♀️','🙅','🙅‍♂️','🙅‍♀️','🙆','🙆‍♂️','🙆‍♀️','💁','💁‍♂️','💁‍♀️','🙋','🙋‍♂️','🙋‍♀️','🧏','🧏‍♂️','🧏‍♀️','🙇','🙇‍♂️','🙇‍♀️','🤦','🤦‍♂️','🤦‍♀️','🤷','🤷‍♂️','🤷‍♀️','👮','👮‍♂️','👮‍♀️','🕵️','🕵️‍♂️','🕵️‍♀️','💂','💂‍♂️','💂‍♀️','🥷','👷','👷‍♂️','👷‍♀️','🤴','👸','👳','👳‍♂️','👳‍♀️','👲','🧕','🤵','🤵‍♂️','🤵‍♀️','👰','👰‍♂️','👰‍♀️','🤰','🤱','👩‍🍼','👨‍🍼','🧑‍🍼','👼','🎅','🤶','🧑‍🎄','🦸','🦸‍♂️','🦸‍♀️','🦹','🦹‍♂️','🦹‍♀️','🧙','🧙‍♂️','🧙‍♀️','🧚','🧚‍♂️','🧚‍♀️','🧛','🧛‍♂️','🧛‍♀️','🧜','🧜‍♂️','🧜‍♀️','🧝','🧝‍♂️','🧝‍♀️','🧞','🧞‍♂️','🧞‍♀️','🧟','🧟‍♂️','🧟‍♀️','💆','💆‍♂️','💆‍♀️','💇','💇‍♂️','💇‍♀️','🚶','🚶‍♂️','🚶‍♀️','🧍','🧍‍♂️','🧍‍♀️','🧎','🧎‍♂️','🧎‍♀️','👨‍🦯','👩‍🦯','🧑‍🦯','👨‍🦼','👩‍🦼','🧑‍🦼','👨‍🦽','👩‍🦽','🧑‍🦽','🏃','🏃‍♂️','🏃‍♀️','💃','🕺','🕴️','👯','👯‍♂️','👯‍♀️','🧖','🧖‍♂️','🧖‍♀️','🧗','🧗‍♂️','🧗‍♀️','🤺','🏇','⛷️','🏂','🏌️','🏌️‍♂️','🏌️‍♀️','🏄','🏄‍♂️','🏄‍♀️','🚣','🚣‍♂️','🚣‍♀️','🏊','🏊‍♂️','🏊‍♀️','⛹️','⛹️‍♂️','⛹️‍♀️','🏋️','🏋️‍♂️','🏋️‍♀️','🚴','🚴‍♂️','🚴‍♀️','🚵','🚵‍♂️','🚵‍♀️','🤸','🤸‍♂️','🤸‍♀️','🤼','🤼‍♂️','🤼‍♀️','🤽','🤽‍♂️','🤽‍♀️','🤾','🤾‍♂️','🤾‍♀️','🤹','🤹‍♂️','🤹‍♀️','🧘','🧘‍♂️','🧘‍♀️','🛀','🛌','🧑‍🤝‍🧑','👭','👫','👬','💏','👩‍❤️‍💋‍👨','👨‍❤️‍💋‍👨','👩‍❤️‍💋‍👩','💑','👩‍❤️‍👨','👨‍❤️‍👨','👩‍❤️‍👩','👨‍👩‍👦','👨‍👩‍👧','👨‍👩‍👧‍👦','👨‍👩‍👦‍👦','👨‍👩‍👧‍👧','👨‍👨‍👦','👨‍👨‍👧','👨‍👨‍👧‍👦','👨‍👨‍👦‍👦','👨‍👨‍👧‍👧','👩‍👩‍👦','👩‍👩‍👧','👩‍👩‍👧‍👦','👩‍👩‍👦‍👦','👩‍👩‍👧‍👧','👨‍👦','👨‍👦‍👦','👨‍👧','👨‍👧‍👦','👨‍👧‍👧','👩‍👦','👩‍👦‍👦','👩‍👧','👩‍👧‍👦','👩‍👧‍👧','🗣️','👤','👥','🫂','👋','🤚','🖐️','✋','🖖','🫱','🫲','🫳','🫴','🫷','🫸','👌','🤌','🤏','✌️','🤞','🫰','🤟','🤘','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🫶','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🧠','🫀','🫁','🦷','🦴','👀','👁️','👅','👄','👶','🧒','👦','👧','🧑','👨','👩','🧓','👴','👵'],
      'Animals & Nature': ['🐵','🐒','🦍','🦧','🐶','🐕','🦮','🐕‍🦺','🐩','🐺','🦊','🦝','🐱','🐈','🐈‍⬛','🦁','🐯','🐅','🐆','🐴','🐎','🦄','🦓','🦌','🦬','🐮','🐂','🐃','🐄','🐷','🐖','🐗','🐽','🐏','🐑','🐐','🐪','🐫','🦙','🦒','🐘','🦣','🦏','🦛','🐭','🐁','🐀','🐹','🐰','🐇','🐿️','🦫','🦔','🦇','🐻','🐻‍❄️','🐨','🐼','🦥','🦦','🦨','🦘','🦡','🐦','🐦‍⬛','🐧','🕊️','🦅','🦆','🦢','🦉','🦤','🪶','🦩','🦚','🦜','🐸','🐊','🐢','🦎','🐍','🐲','🐉','🐳','🐋','🐬','🦭','🐟','🐠','🐡','🦈','🐙','🐚','🐌','🦋','🐛','🐜','🐝','🪲','🐞','🦗','🪳','🕷️','🕸️','🦂','🦟','🪰','🪱','🦠','💐','🌸','💮','🏵️','🌹','🥀','🌺','🌻','🌼','🌷','🌱','🪴','🌲','🌳','🌴','🌵','🌾','🌿','☘️','🍀','🍁','🍂','🍃','🪺','🍄','🪨','⚡','🔥','💧','🫗','🌊','🫧','☀️','🌤️','⛅','🌥️','☁️','🌦️','🌧️','⛈️','🌩️','🌨️','❄️','☃️','⛄','🌬️','💨','💦','🫧','🌪️','🌫️','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌙','🌚','🌛','🌜','🌡️','☄️','🪐','⭐','🌟','🌠','🪩','🌈','🌍','🌎','🌏','🗺️','🧭','🏔️','⛰️','🌋','🗻','🏕️','🏖️','🏜️','🏝️','🏞️','🌅','🌄','🎑','🌇','🌆','🏙️','🌃','🌌','🌉','🌠'],
      'Food & Drink': ['🍇','🍈','🍉','🍊','🍋','🍌','🍍','🥭','🍎','🍏','🍐','🍑','🍒','🍓','🫐','🥝','🍅','🫒','🥑','🍆','🥔','🥕','🌽','🌶️','🫑','🥒','🥬','🥦','🧄','🧅','🍄','🥜','🫘','🌰','🍞','🥐','🥖','🫓','🥨','🥯','🥞','🧇','🧀','🍖','🍗','🥩','🥓','🍔','🍟','🍕','🌭','🥪','🌮','🌯','🫔','🥙','🧆','🥚','🍳','🥘','🍲','🫕','🥣','🥗','🍿','🧈','🧂','🥫','🍱','🍘','🍙','🍚','🍛','🍜','🍝','🍠','🍢','🍣','🍤','🍥','🥮','🍡','🥟','🥠','🥡','🍦','🍧','🍨','🍩','🍪','🎂','🍰','🧁','🥧','🍫','🍬','🍭','🍮','🍯','🍼','🥛','☕','🫖','🍵','🍶','🍾','🍷','🍸','🍹','🍺','🍻','🥂','🥃','🫗','🥤','🧋','🧃','🧉','🧊','🥢','🍴','🥄','🔪','🍽️','🏺','🫙','🧂'],
      'Activities & Sports': ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🏏','🎿','⛷️','🏂','🪂','🏋️','🏋️‍♂️','🏋️‍♀️','🤼','🤼‍♂️','🤼‍♀️','🤸','🤸‍♂️','🤸‍♀️','⛹️','⛹️‍♂️','⛹️‍♀️','🤾','🤾‍♂️','🤾‍♀️','🏌️','🏌️‍♂️','🏌️‍♀️','🏇','🧘','🧘‍♂️','🧘‍♀️','🏄','🏄‍♂️','🏄‍♀️','🏊','🏊‍♂️','🏊‍♀️','🤽','🤽‍♂️','🤽‍♀️','🚣','🚣‍♂️','🚣‍♀️','🧗','🧗‍♂️','🧗‍♀️','🚵','🚵‍♂️','🚵‍♀️','🚴','🚴‍♂️','🚴‍♀️','🤹','🤹‍♂️','🤹‍♀️','🤺','🥊','🥋','🎯','🛹','🛼','🛶','⛸️','🎣','🎽','🎖️','🏆','🏅','🥇','🥈','🥉','🎗️','♟️','🎪','🪘','🎮','🕹️','🎰','🎲','🧩','🪀','🪁','🎳','🛝','🎭','🩰','🎨','🎬','🎤','🎧','🎼','🎹','🥁','🪇','🪈','🎷','🎺','🎸','🪕','🎻','🎵','🎶','🤿','🎟️','🎫','🎭','🪩','🎪','🥁','🪘','🪇','🪈','🥊','🥋','🤺','🎯','🎖️','🏆','🏅','🥇','🥈','🥉','🎗️'],
      'Travel & Places': ['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🦯','🦽','🦼','🛴','🚲','🛵','🏍️','🛺','🚨','🚔','🚍','🚘','🚖','🚡','🚠','🚟','🚃','🚋','🚞','🚝','🚄','🚅','🚈','🚂','🚆','🚇','🚊','🚉','✈️','🛫','🛬','🛩️','💺','🛰️','🚀','🛸','🚁','🛶','⛵','🚤','🛥️','🛳️','⛴️','🚢','🚂','🚃','🚄','🚅','🚆','🚇','🚈','🚉','🚊','🚝','🚞','🚋','🚠','🚡','🚟','🚠','🚡','🛫','🛬','🛩️','💺','🛰️','🚀','🛸','🚁','🛶','⛵','🚤','🛥️','🛳️','⛴️','🚢','🏘️','🏛️','🏗️','🧱','🪨','🪵','🛖','🏠','🏡','🏢','🏣','🏤','🏥','🏦','🏨','🏩','🏪','🏫','🏬','🏭','🏯','🏰','💒','🗼','🗽','⛪','🕌','🛕','🕍','⛩️','🕋','🌋','🗻','🏔️','⛰️','🏕️','🏖️','🏜️','🏝️','🏞️','🏟️','🏛️','🏗️','🎪','🛤️','🛣️','🛢️','⛽','🚧','🚦','🚥','🏎️','🗺️','🧭','🌐','🎠','🎡','🎢','💈','🏗️','🌁','🌃','🏙️','🌄','🌅','🌆','🌇','🌉','♨️','🎭','🖼️','🎨','🎪','⛲','⛺','🌁','🌃','🏙️','🌄','🌅','🌆','🌇','🌉','♨️','🎠','🎡','🎢','💈','🎪','🚂','🚃','🚄','🚅','🚆','🚇','🚈','🚉','🚊','🚝','🚞','🚋','🚠','🚡','🚢','🚣','🚤','🚥','🚦','🚧','🛑','⚓','⛽','🚏','🎯','🛶','🛳️','🛴','🛵','🛺','🛤️','🛣️','🛢️','🗺️','🧭','🌐','🏔️','⛰️','🌋','🗻','🏨','🏩','🏪','🏫','🏬','🏭','🏯','🏰','⛪','🕌','🛕','🕍','⛩️','🕋','🏗️','🧱','🪨','🪵','🛖','🚧','🚦','🚥','🛑','⛽','🚏'],
      'Objects & Symbols': ['💡','🔦','🪔','🏮','🪩','🧭','🕰️','⏰','⏲️','🕛','🕧','🕐','🕜','🕑','🕝','🕒','🕞','🕓','🕟','🕔','🕠','🕕','🕡','🕖','🕢','🕗','🕣','🕘','🕤','🕙','🕥','🕚','🕦','⌛','⏳','📡','🔌','🔋','🪫','💻','🖥️','🖨️','⌨️','🖱️','🖲️','💾','💿','📀','📼','📷','📸','📹','🎥','📽️','🎞️','📞','☎️','📟','📠','📺','📻','🎙️','🎚️','🎛️','🧮','📔','📕','📖','📗','📘','📙','📚','📓','📒','📃','📜','📄','📰','🗞️','📑','🔖','🏷️','💰','🪙','💴','💵','💶','💷','💸','🪙','💳','🧾','✉️','📧','📨','📩','📤','📥','📦','📫','📪','📬','📭','📮','🗳️','✏️','✒️','🖋️','🖊️','🖌️','🖍️','📝','💼','📁','📂','🗂️','📅','📆','🗒️','🗓️','📇','📈','📉','📊','📋','📌','📍','📎','🖇️','📏','📐','✂️','🗃️','🗄️','🗑️','🔒','🔓','🔏','🔐','🔑','🗝️','🔨','🪓','⛏️','⚒️','🛠️','🗡️','⚔️','🔫','🪃','🏹','🛡️','🔧','🔩','⚙️','🗜️','⚖️','🦯','🔗','⛓️','🧰','🧲','🪜','⚗️','🧪','🧫','🧬','🔬','🔭','📡','💉','🩸','💊','🩹','🩺','🪣','🧴','🧷','🧹','🧺','🧻','🪥','🧼','🫙','🧽','🧯','🛒','👑','👒','🎩','🎓','🧢','🪖','⛑️','📿','💄','💍','💎','👓','🕶️','🥽','🥼','🦺','👔','👕','👖','🧣','🧤','🧥','🧦','👗','👘','🥻','🩱','🩲','🩳','👙','👚','👛','👜','👝','🛍️','🎒','👞','👟','🥾','🥿','👠','👡','🩰','👢','👑','👒','🎩','🎓','🧢','🪖','⛑️','⬆️','↗️','➡️','↘️','⬇️','↙️','⬅️','↖️','↕️','↔️','↩️','↪️','⤴️','⤵️','🔃','🔄','🔙','🔚','🔛','🔜','🔝','☮️','✝️','☪️','🕉️','☸️','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛️','▶️','⏸️','⏹️','⏺️','⏭️','⏮️','⏩','⏪','⏫','⏬','◀️','🔼','🔽','➡️','⬅️','⬆️','⬇️','🗨️','🔶','🔷','🔸','🔹','🔺','🔻','💠','🔘','🔳','🔲','🏁','🚩','🎌','🏴','🏳️','🏳️‍🌈','🏳️‍⚧️','🏴‍☠️','⚠️','🚸','⛔','🚫','🚳','🚭','🚯','🚱','🚷','📵','🔞','☢️','☣️','⚜️','🔱','📛','🔰','♨️','💢','💬','👁️‍🗨️','🗯️','💭','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚','🕛','🕜','🕝','🕞','🕟','🕠','🕡','🕢','🕣','🕤','🕥','🕦','✖️','➕','➖','➗','♾️','💲','💱','™️','©️','®️','〰️','➰','➿','🔚','🔙','🔛','🔝','🔜','❌','⭕','💯','✔️','☑️','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔺','🔻','🔸','🔹','🔶','🔷','🔳','🔲','▪️','▫️','◾','◽','◼️','◻️','🟥','🟧','🟨','🟩','🟦','🟪','⬛','⬜','🟫','🔈','🔇','🔉','🔊','📢','📣','📯','🔔','🔕','💤','🔄','🔀','🔁','🔂','🎵','🎶','➕','➖','➗','♠️','♥️','♦️','♣️','🃏','🀄','🎴','🔇','🔈','🔉','🔊','📳','📴','♀️','♂️','⚧️','✖️','➕','➖','➗','♾️','‼️','⁉️','❓','❔','❕','❗','〰️','💱','💲','⚕️','♻️','⚜️','🔱','📛','🔰','⭕','✅','☑️','✔️','❌','❎','➰','➿','〽️','✳️','✴️','❇️','©️','®️','™️','🔠','🔡','🔢','🔣','🔤','🅰️','🆎','🅱️','🆑','🆒','🆓','ℹ️','🆔','Ⓜ️','🆕','🆖','🅾️','🆗','🅿️','🆘','🆙','🆚','🈁','🈂️','🈷️','🈶','🈯','🉐','🈹','🈚','🈲','🉑','🈸','🈴','🈳','㊗️','㊙️','🈺','🈵','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔘','🔺','🔻','🔸','🔹','🔶','🔷','🔳','🔲','▪️','▫️','◾','◽','◼️','◻️','🟥','🟧','🟨','🟩','🟦','🟪','⬛','⬜','🟫','🏴','🏳️']
    };

    // Create the main container with vertical layout
    const pickerContent = document.createElement('div');
    pickerContent.style.cssText = `
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      padding: 12px;
      box-sizing: border-box;
    `;

    // Create category navigation header
    const categoryHeader = this.createCategoryHeader(emojiSections);
    
    // Create emoji grid container with vertical scroll
    const emojiGridContainer = document.createElement('div');
    emojiGridContainer.className = 'emoji-grid-container';
    emojiGridContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 4px;
    `;

    // Create all emoji sections
    this.createAllEmojiSections(emojiSections, emojiGridContainer);

    // Assemble the picker
    pickerContent.appendChild(categoryHeader);
    pickerContent.appendChild(emojiGridContainer);
    this.emojiPicker.appendChild(pickerContent);
    document.body.appendChild(this.emojiPicker);

    // Close picker when clicking outside (but not when clicking emojis)
    document.addEventListener('click', (e) => {
      if (this.isPickerVisible && 
          !this.emojiPicker.contains(e.target) && 
          e.target !== this.emojiButton &&
          !e.target.closest('.google-meet-emoji-picker')) {
        this.hideEmojiPicker();
      }
    });
  }

  createCategoryHeader(emojiSections) {
    const categoryHeader = document.createElement('div');
    categoryHeader.style.cssText = `
      display: flex;
      border-bottom: 1px solid #eee;
      margin-bottom: 12px;
      padding-bottom: 8px;
      gap: 4px;
      flex-shrink: 0;
    `;

    const categoryIcons = {
      'Smileys & People': '😀',
      'Animals & Nature': '🐶',
      'Food & Drink': '🍎',
      'Activities & Sports': '⚽',
      'Travel & Places': '🚗',
      'Objects & Symbols': '❤️'
    };

    Object.keys(emojiSections).forEach(sectionName => {
      const categoryButton = document.createElement('button');
      categoryButton.textContent = categoryIcons[sectionName];
      categoryButton.title = sectionName;
      categoryButton.dataset.section = sectionName;
      categoryButton.style.cssText = `
        background: none;
        border: none;
        padding: 6px 8px;
        cursor: pointer;
        font-size: 18px;
        border-radius: 6px;
        transition: all 0.2s ease;
        flex: 1;
      `;

      categoryButton.addEventListener('mouseenter', () => {
        categoryButton.style.backgroundColor = '#f0f0f0';
      });

      categoryButton.addEventListener('mouseleave', () => {
        categoryButton.style.backgroundColor = 'transparent';
      });

      categoryButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.scrollToSection(sectionName);
      });

      categoryHeader.appendChild(categoryButton);
    });

    return categoryHeader;
  }

  scrollToSection(sectionName) {
    const sectionElement = this.sectionElements.get(sectionName);
    if (sectionElement) {
      const container = this.emojiPicker.querySelector('.emoji-grid-container');
      const headerOffset = 60; // Account for category header height
      
      container.scrollTo({
        top: sectionElement.offsetTop - headerOffset,
        behavior: 'smooth'
      });
    }
  }

  createAllEmojiSections(emojiSections, container) {
    container.innerHTML = '';
    this.sectionElements.clear();

    Object.keys(emojiSections).forEach(sectionName => {
      // Create section wrapper
      const sectionWrapper = document.createElement('div');
      sectionWrapper.className = 'emoji-section';
      sectionWrapper.dataset.section = sectionName;

      // Create section header
      const sectionHeader = document.createElement('div');
      sectionHeader.textContent = sectionName;
      sectionHeader.style.cssText = `
        font-size: 14px;
        font-weight: 600;
        color: #5f6368;
        margin: 16px 0 8px 0;
        padding: 0 4px;
        background: white;
        position: sticky;
        top: 0;
        z-index: 1;
      `;

      // Create section grid
      const sectionGrid = document.createElement('div');
      sectionGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 4px;
        margin-bottom: 16px;
        padding: 0 4px;
      `;

      // Add emojis to section
      emojiSections[sectionName].forEach(emoji => {
        const emojiButton = document.createElement('button');
        emojiButton.textContent = emoji;
        emojiButton.style.cssText = `
          background: none;
          border: none;
          font-size: 22px;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s ease;
          min-width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        `;

        emojiButton.addEventListener('mouseenter', () => {
          emojiButton.style.backgroundColor = '#f0f0f0';
          emojiButton.style.transform = 'scale(1.1)';
        });

        emojiButton.addEventListener('mouseleave', () => {
          emojiButton.style.backgroundColor = 'transparent';
          emojiButton.style.transform = 'scale(1)';
        });

        emojiButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.insertEmoji(emoji);
        });

        sectionGrid.appendChild(emojiButton);
      });

      sectionWrapper.appendChild(sectionHeader);
      sectionWrapper.appendChild(sectionGrid);
      container.appendChild(sectionWrapper);
      
      // Store reference for scrolling
      this.sectionElements.set(sectionName, sectionWrapper);
    });
  }

  toggleEmojiPicker(inputElement) {
    this.currentInput = inputElement;
    
    if (this.isPickerVisible) {
      this.hideEmojiPicker();
    } else {
      this.showEmojiPicker();
    }
  }

  showEmojiPicker() {
    if (!this.emojiPicker || !this.emojiButton) return;

    const buttonRect = this.emojiButton.getBoundingClientRect();
    const pickerHeight = 380;
    const viewportHeight = window.innerHeight;
    
    // Calculate available space above and below the button
    const spaceAbove = buttonRect.top;
    const spaceBelow = viewportHeight - buttonRect.bottom;
    
    let topPosition;
    
    // Prefer positioning above the button if there's enough space
    if (spaceAbove > pickerHeight || spaceAbove > spaceBelow) {
      // Position above the button
      topPosition = buttonRect.top + window.scrollY - pickerHeight - 10;
    } else {
      // Position below the button
      topPosition = buttonRect.bottom + window.scrollY + 10;
    }
    
    // Ensure picker doesn't go off-screen
    topPosition = Math.max(10, Math.min(topPosition, viewportHeight + window.scrollY - pickerHeight - 10));
    
    this.emojiPicker.style.display = 'block';
    this.emojiPicker.style.top = `${topPosition}px`;
    this.emojiPicker.style.left = `${buttonRect.left + window.scrollX}px`;
    
    this.isPickerVisible = true;

    // Adjust if picker goes beyond right edge of viewport
    this.adjustPickerPosition();

    // Focus the input so user can continue typing
    if (this.currentInput) {
      this.currentInput.focus();
    }
  }

  adjustPickerPosition() {
    if (!this.emojiPicker) return;

    const pickerRect = this.emojiPicker.getBoundingClientRect();

    // If picker goes beyond right edge of viewport, adjust left position
    if (pickerRect.right > window.innerWidth - 10) {
      this.emojiPicker.style.left = `${window.innerWidth - pickerRect.width - 10}px`;
    }
    
    // If picker goes beyond left edge of viewport, adjust left position
    if (pickerRect.left < 10) {
      this.emojiPicker.style.left = '10px';
    }
  }

  hideEmojiPicker() {
    if (this.emojiPicker) {
      this.emojiPicker.style.display = 'none';
      this.isPickerVisible = false;
    }
  }

  insertEmoji(emoji) {
    if (!this.currentInput) return;

    if (this.currentInput.isContentEditable || this.currentInput.tagName === 'DIV') {
      this.currentInput.focus();
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(emoji);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        this.currentInput.textContent += emoji;
      }
      
      this.currentInput.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      const start = this.currentInput.selectionStart;
      const end = this.currentInput.selectionEnd;
      const value = this.currentInput.value;
      
      this.currentInput.value = value.substring(0, start) + emoji + value.substring(end);
      this.currentInput.selectionStart = this.currentInput.selectionEnd = start + emoji.length;
      
      this.currentInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Keep focus on the input so user can continue typing or selecting more emojis
    this.currentInput.focus();
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new GoogleMeetEmojiPicker();
  });
} else {
  new GoogleMeetEmojiPicker();
}