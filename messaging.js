// messaging.js - Handles messaging functionality for FlipNest

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Check if we're being redirected from login
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    
    if (!user) {
        // Save the current page URL to redirect back after login
        sessionStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
        return;
    } else if (justLoggedIn) {
        // Clear the redirect flag to prevent loops
        sessionStorage.removeItem('justLoggedIn');
    }
    
    // Set a session flag to indicate user is active
    sessionStorage.setItem('userSessionActive', 'true');
    
    // Refresh user session periodically (every 5 minutes)
    setInterval(() => {
        sessionStorage.setItem('userSessionActive', 'true');
    }, 300000);

    // DOM Elements
    const conversationList = document.getElementById('conversation-list');
    const noConversation = document.getElementById('no-conversation');
    const chatInterface = document.getElementById('chat-interface');
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const newMessageBtn = document.getElementById('new-message-btn');
    const startConversationBtn = document.getElementById('start-conversation-btn');
    const newMessageModal = document.getElementById('new-message-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelMessageBtn = document.getElementById('cancel-message-btn');
    const sendNewMessageBtn = document.getElementById('send-new-message-btn');
    const recipientSelect = document.getElementById('recipient');
    const subjectInput = document.getElementById('subject');
    const messageTextarea = document.getElementById('message');
    const searchMessages = document.getElementById('search-messages');
    const chatUserName = document.getElementById('chat-user-name');
    const chatUserStatus = document.getElementById('chat-user-status');
    const chatUserAvatar = document.getElementById('chat-user-avatar');

    // Current conversation data
    let currentConversation = null;
    let conversations = [];
    let allUsers = [];

    // Initialize
    loadConversations();
    loadUsers();
    updateHeader();

    // Event Listeners
    newMessageBtn.addEventListener('click', openNewMessageModal);
    startConversationBtn.addEventListener('click', openNewMessageModal);
    closeModalBtn.addEventListener('click', closeNewMessageModal);
    cancelMessageBtn.addEventListener('click', closeNewMessageModal);
    sendNewMessageBtn.addEventListener('click', sendNewMessage);
    sendMessageBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    searchMessages.addEventListener('input', filterConversations);

    // Functions
    function updateHeader() {
        // Update username in header
        const usernameElement = document.getElementById('username');
        if (usernameElement && user) {
            usernameElement.textContent = user.firstName;
        }

        // Update cart count
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cartItems.length;
            if (cartItems.length > 0) {
                cartCount.classList.add('active');
            } else {
                cartCount.classList.remove('active');
            }
        }

        // Show user profile, hide login/register buttons
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const userProfile = document.querySelector('.user-profile');
        
        if (loginBtn && registerBtn && userProfile) {
            loginBtn.parentElement.classList.add('hidden');
            registerBtn.parentElement.classList.add('hidden');
            userProfile.classList.remove('hidden');
        }
    }

    function loadConversations() {
        // Get conversations from localStorage or create empty array
        conversations = JSON.parse(localStorage.getItem('conversations')) || [];
        
        // Filter conversations for current user
        conversations = conversations.filter(conv => 
            conv.participants.includes(user.id) || 
            conv.participants.includes(user.email)
        );

        // If no conversations, show empty state
        if (conversations.length === 0) {
            conversationList.innerHTML = `
                <li class="empty-state">
                    <p>No conversations yet</p>
                </li>
            `;
            return;
        }

        // Sort conversations by last message date (newest first)
        conversations.sort((a, b) => {
            const aLastMessage = a.messages[a.messages.length - 1];
            const bLastMessage = b.messages[b.messages.length - 1];
            return new Date(bLastMessage.timestamp) - new Date(aLastMessage.timestamp);
        });

        // Render conversation list
        renderConversationList();
    }

    function renderConversationList() {
        conversationList.innerHTML = '';
        
        conversations.forEach(conv => {
            // Find the other participant (not the current user)
            const otherParticipantId = conv.participants.find(p => p !== user.id && p !== user.email);
            const otherUser = allUsers.find(u => u.id === otherParticipantId || u.email === otherParticipantId) || {
                firstName: 'Unknown',
                lastName: 'User',
                avatar: 'https://via.placeholder.com/50x50?text=User'
            };
            
            // Get last message
            const lastMessage = conv.messages[conv.messages.length - 1];
            const isUnread = lastMessage.senderId !== user.id && !lastMessage.read;
            
            // Format timestamp
            const messageDate = new Date(lastMessage.timestamp);
            const now = new Date();
            let timeString;
            
            if (messageDate.toDateString() === now.toDateString()) {
                // Today, show time
                timeString = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else if (messageDate.getFullYear() === now.getFullYear()) {
                // This year, show month and day
                timeString = messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
            } else {
                // Different year, show date with year
                timeString = messageDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
            }
            
            // Create conversation item
            const conversationItem = document.createElement('li');
            conversationItem.className = `conversation-item${isUnread ? ' unread' : ''}${currentConversation && currentConversation.id === conv.id ? ' active' : ''}`;
            conversationItem.dataset.conversationId = conv.id;
            
            conversationItem.innerHTML = `
                <div class="conversation-avatar">
                    <img src="${otherUser.avatar || 'https://via.placeholder.com/50x50?text=User'}" alt="${otherUser.firstName}" 
                        onerror="this.src='https://via.placeholder.com/50x50?text=User'">
                    <span class="status ${Math.random() > 0.5 ? 'status-online' : 'status-offline'}"></span>
                </div>
                <div class="conversation-info">
                    <div class="conversation-name">
                        ${otherUser.firstName} ${otherUser.lastName}
                        <span class="conversation-time">${timeString}</span>
                    </div>
                    <div class="conversation-preview">${lastMessage.text}</div>
                </div>
            `;
            
            // Add click event to open conversation
            conversationItem.addEventListener('click', () => openConversation(conv.id));
            
            conversationList.appendChild(conversationItem);
        });
    }

    function loadUsers() {
        // Get users from localStorage
        allUsers = JSON.parse(localStorage.getItem('users')) || [];
        
        // If no users found, add some sample users
        if (allUsers.length === 0) {
            allUsers = [
                {
                    id: '1',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
                },
                {
                    id: '2',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    email: 'jane@example.com',
                    avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
                },
                {
                    id: '3',
                    firstName: 'Robert',
                    lastName: 'Johnson',
                    email: 'robert@example.com',
                    avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
                }
            ];
            
            // Save sample users to localStorage
            localStorage.setItem('users', JSON.stringify(allUsers));
        }
        
        // Populate recipient select in new message modal
        populateRecipientSelect();
    }

    function populateRecipientSelect() {
        // Clear existing options except the default one
        recipientSelect.innerHTML = '<option value="">Select a user</option>';
        
        // Filter out current user
        const otherUsers = allUsers.filter(u => u.id !== user.id && u.email !== user.email);
        
        // Add options for each user
        otherUsers.forEach(u => {
            const option = document.createElement('option');
            option.value = u.id || u.email;
            option.textContent = `${u.firstName} ${u.lastName}`;
            recipientSelect.appendChild(option);
        });
    }

    function openNewMessageModal() {
        newMessageModal.style.display = 'flex';
        recipientSelect.focus();
    }

    function closeNewMessageModal() {
        newMessageModal.style.display = 'none';
        // Clear form
        recipientSelect.value = '';
        subjectInput.value = '';
        messageTextarea.value = '';
    }

    function sendNewMessage() {
        const recipientId = recipientSelect.value;
        const subject = subjectInput.value.trim();
        const messageText = messageTextarea.value.trim();
        
        // Validate form
        if (!recipientId) {
            alert('Please select a recipient');
            return;
        }
        
        if (!subject) {
            alert('Please enter a subject');
            return;
        }
        
        if (!messageText) {
            alert('Please enter a message');
            return;
        }
        
        // Check if conversation already exists with this user
        let conversation = conversations.find(conv => 
            conv.participants.includes(recipientId) && 
            (conv.participants.includes(user.id) || conv.participants.includes(user.email))
        );
        
        if (!conversation) {
            // Create new conversation
            conversation = {
                id: generateId(),
                subject: subject,
                participants: [user.id || user.email, recipientId],
                messages: [],
                createdAt: new Date().toISOString()
            };
            
            // Add to conversations array
            conversations.push(conversation);
        }
        
        // Add message to conversation
        const message = {
            id: generateId(),
            senderId: user.id || user.email,
            text: messageText,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        conversation.messages.push(message);
        
        // Save to localStorage
        saveConversations();
        
        // Close modal and open conversation
        closeNewMessageModal();
        openConversation(conversation.id);
    }

    function openConversation(conversationId) {
        // Find conversation
        currentConversation = conversations.find(conv => conv.id === conversationId);
        
        if (!currentConversation) {
            return;
        }
        
        // Show chat interface, hide empty state
        noConversation.style.display = 'none';
        chatInterface.style.display = 'flex';
        
        // Find the other participant
        const otherParticipantId = currentConversation.participants.find(p => 
            p !== user.id && p !== user.email
        );
        
        const otherUser = allUsers.find(u => 
            u.id === otherParticipantId || u.email === otherParticipantId
        ) || {
            firstName: 'Unknown',
            lastName: 'User',
            avatar: 'https://via.placeholder.com/40x40?text=User'
        };
        
        // Update chat header
        chatUserName.textContent = `${otherUser.firstName} ${otherUser.lastName}`;
        chatUserStatus.textContent = currentConversation.subject;
        chatUserAvatar.src = otherUser.avatar || 'https://via.placeholder.com/40x40?text=User';
        
        // Mark messages as read
        currentConversation.messages.forEach(msg => {
            if (msg.senderId !== user.id && !msg.read) {
                msg.read = true;
            }
        });
        
        // Save to localStorage
        saveConversations();
        
        // Update conversation list to reflect read status
        renderConversationList();
        
        // Render messages
        renderMessages();
        
        // Focus on message input
        messageInput.focus();
    }

    function renderMessages() {
        chatMessages.innerHTML = '';
        
        if (!currentConversation || currentConversation.messages.length === 0) {
            chatMessages.innerHTML = '<div class="no-messages">No messages yet</div>';
            return;
        }
        
        // Sort messages by timestamp (oldest first)
        const sortedMessages = [...currentConversation.messages].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        
        // Group messages by date
        let currentDate = null;
        
        sortedMessages.forEach(msg => {
            const messageDate = new Date(msg.timestamp);
            const messageDay = messageDate.toDateString();
            
            // Add date separator if this is a new day
            if (messageDay !== currentDate) {
                currentDate = messageDay;
                
                const dateSeparator = document.createElement('div');
                dateSeparator.className = 'date-separator';
                
                // Format date
                const today = new Date().toDateString();
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayString = yesterday.toDateString();
                
                let dateText;
                if (messageDay === today) {
                    dateText = 'Today';
                } else if (messageDay === yesterdayString) {
                    dateText = 'Yesterday';
                } else {
                    dateText = messageDate.toLocaleDateString([], {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: messageDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                    });
                }
                
                dateSeparator.innerHTML = `<span>${dateText}</span>`;
                chatMessages.appendChild(dateSeparator);
            }
            
            // Create message element
            const messageEl = document.createElement('div');
            messageEl.className = `message ${msg.senderId === user.id || msg.senderId === user.email ? 'sent' : 'received'}`;
            
            // Format time
            const timeString = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            messageEl.innerHTML = `
                <div class="message-bubble">${msg.text}</div>
                <div class="message-time">${timeString}</div>
            `;
            
            chatMessages.appendChild(messageEl);
        });
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        const messageText = messageInput.value.trim();
        
        if (!messageText || !currentConversation) {
            return;
        }
        
        // Create message object
        const message = {
            id: generateId(),
            senderId: user.id || user.email,
            text: messageText,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        // Add to conversation
        currentConversation.messages.push(message);
        
        // Save to localStorage
        saveConversations();
        
        // Clear input
        messageInput.value = '';
        
        // Render messages
        renderMessages();
        
        // Update conversation list
        renderConversationList();
    }

    function filterConversations() {
        const searchTerm = searchMessages.value.toLowerCase();
        
        // If no search term, show all conversations
        if (!searchTerm) {
            renderConversationList();
            return;
        }
        
        // Filter conversation items
        const items = conversationList.querySelectorAll('.conversation-item');
        
        items.forEach(item => {
            const name = item.querySelector('.conversation-name').textContent.toLowerCase();
            const preview = item.querySelector('.conversation-preview').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || preview.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function saveConversations() {
        // Get all conversations from localStorage
        let allConversations = JSON.parse(localStorage.getItem('conversations')) || [];
        
        // Remove conversations that match the ones we're updating
        allConversations = allConversations.filter(conv => 
            !conversations.some(c => c.id === conv.id)
        );
        
        // Add our updated conversations
        allConversations = [...allConversations, ...conversations];
        
        // Save back to localStorage
        localStorage.setItem('conversations', JSON.stringify(allConversations));
    }

    function generateId() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    // Add sample conversations if none exist
    function addSampleConversations() {
        if (conversations.length === 0 && allUsers.length > 0) {
            // Create sample conversations with each user
            allUsers.forEach(otherUser => {
                if (otherUser.id === user.id || otherUser.email === user.email) {
                    return; // Skip current user
                }
                
                const conversation = {
                    id: generateId(),
                    subject: 'About your listing',
                    participants: [user.id || user.email, otherUser.id || otherUser.email],
                    messages: [
                        {
                            id: generateId(),
                            senderId: otherUser.id || otherUser.email,
                            text: `Hi ${user.firstName}, I'm interested in your listing. Is it still available?`,
                            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
                            read: true
                        },
                        {
                            id: generateId(),
                            senderId: user.id || user.email,
                            text: `Hi ${otherUser.firstName}, yes it's still available! When would you like to meet?`,
                            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
                            read: true
                        },
                        {
                            id: generateId(),
                            senderId: otherUser.id || otherUser.email,
                            text: 'Great! How about tomorrow at 3pm?',
                            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
                            read: false
                        }
                    ],
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
                };
                
                conversations.push(conversation);
            });
            
            // Save to localStorage
            saveConversations();
            
            // Render conversation list
            renderConversationList();
        }
    }

    // Add sample data after a short delay
    setTimeout(() => {
        addSampleConversations();
    }, 500);
});

// Add CSS for date separator
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .date-separator {
            text-align: center;
            margin: 20px 0;
            position: relative;
        }
        
        .date-separator::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            width: 100%;
            height: 1px;
            background-color: #eee;
            z-index: 1;
        }
        
        .date-separator span {
            background-color: #f9f9f9;
            padding: 0 10px;
            position: relative;
            z-index: 2;
            color: #999;
            font-size: 12px;
        }
        
        .no-messages {
            text-align: center;
            color: #999;
            margin-top: 50px;
        }
        
        .empty-state {
            padding: 30px 20px;
            text-align: center;
            color: #999;
        }
    `;
    document.head.appendChild(style);
});
