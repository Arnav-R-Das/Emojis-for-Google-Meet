class GoogleMeetEmojiPicker {
  constructor() {
    this.emojiButton = null;
    this.emojiPicker = null;
    this.isPickerVisible = false;
    this.currentInput = null;
    this.initialized = false;
    
    this.init();
  }

  init() {
    this.waitForChatInput();
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

  createEmojiButton(chatContainer) {
    // Remove any existing buttons first
    this.removeExistingButtons();
    
    // Create emoji button
    this.emojiButton = document.createElement('button');
    this.emojiButton.innerHTML = '😊';
    this.emojiButton.className = 'google-meet-emoji-button';
    this.emojiButton.type = 'button';
    this.emojiButton.title = 'Insert emoji';
    
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
      padding: 12px;
      z-index: 10000;
      width: 320px;
      height: 400px;
      display: none;
      font-family: 'Segoe UI', system-ui, sans-serif;
      overflow: hidden;
    `;

    // All emojis organized by sections
    const emojiSections = {
      'Smileys & People': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'],
      'Animals & Nature': ['🐵', '🐒', '🦍', '🦧', '🐶', '🐕', '🦮', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿️', '🦔', '🦇', '🐻', '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', '🕊️', '🦅', '🦆', '🦢', '🦉', '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖', '🐳', '🐋', '🐬', '🐟', '🐠', '🐡', '🦈', '🐙', '🐚', '🐌', '🦋', '🐛', '🐜', '🐝', '🐞', '🦗', '🕷️', '🕸️', '🦂', '🦟', '🦠', '💐', '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃'],
      'Food & Drink': ['🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🦀', '🦞', '🦐', '🦑', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧃', '🧉', '🧊'],
      'Activities & Sports': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤾', '🚴', '🚵', '🧗', '🤺', '🏇', '⛸️', '🎣', '🤿', '🎽', '🎿', '🛷', '🥌', '🎯', '🎱', '🔫', '🎮', '🕹️', '🎲', '🧩', '♟️', '🎭', '🎨', '🧵', '🧶', '🎼', '🎵', '🎶', '🎤', '🎧', '🎷', '🎸', '🎹', '🎺', '🎻', '🪕', '🥁', '🪘', '🎬'],
      'Travel & Places': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🦯', '🦽', '🦼', '🛴', '🚲', '🛵', '🏍️', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '⛽', '🚧', '🚦', '🚥', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', '🎠', '🎡', '🎢', '💈', '🎪'],
      'Objects & Symbols': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜']
    };

    // Create the main container with vertical layout
    const pickerContent = document.createElement('div');
    pickerContent.style.cssText = `
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    `;

    // Create emoji grid container with vertical scroll
    const emojiGridContainer = document.createElement('div');
    emojiGridContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    `;

    // Create all emoji sections
    this.createAllEmojiSections(emojiSections, emojiGridContainer);

    // Assemble the picker
    pickerContent.appendChild(emojiGridContainer);
    this.emojiPicker.appendChild(pickerContent);
    document.body.appendChild(this.emojiPicker);

    // Close picker when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isPickerVisible && !this.emojiPicker.contains(e.target) && e.target !== this.emojiButton) {
        this.hideEmojiPicker();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isPickerVisible) {
        this.hideEmojiPicker();
      }
    });
  }

  createAllEmojiSections(emojiSections, container) {
    container.innerHTML = '';

    Object.keys(emojiSections).forEach(sectionName => {
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
        gap: 6px;
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
          padding: 6px;
          border-radius: 6px;
          transition: all 0.2s ease;
        `;

        emojiButton.addEventListener('mouseenter', () => {
          emojiButton.style.backgroundColor = '#f0f0f0';
          emojiButton.style.transform = 'scale(1.1)';
        });

        emojiButton.addEventListener('mouseleave', () => {
          emojiButton.style.backgroundColor = 'transparent';
          emojiButton.style.transform = 'scale(1)';
        });

        emojiButton.addEventListener('click', () => {
          this.insertEmoji(emoji);
        });

        sectionGrid.appendChild(emojiButton);
      });

      container.appendChild(sectionHeader);
      container.appendChild(sectionGrid);
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
    const pickerHeight = 320;
    
    // Position above the button
    this.emojiPicker.style.display = 'block';
    this.emojiPicker.style.top = `${buttonRect.top + window.scrollY - pickerHeight - 10}px`;
    this.emojiPicker.style.left = `${buttonRect.left + window.scrollX}px`;
    
    this.isPickerVisible = true;

    // Adjust if picker goes above viewport
    this.adjustPickerPosition();
  }

  adjustPickerPosition() {
    if (!this.emojiPicker) return;

    const pickerRect = this.emojiPicker.getBoundingClientRect();

    if (pickerRect.top < 10) {
      const buttonRect = this.emojiButton.getBoundingClientRect();
      this.emojiPicker.style.top = `${buttonRect.bottom + window.scrollY + 10}px`;
    }

    if (pickerRect.right > window.innerWidth - 10) {
      this.emojiPicker.style.left = `${window.innerWidth - pickerRect.width - 10}px`;
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

    this.hideEmojiPicker();
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