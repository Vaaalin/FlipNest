// messages.js - Handles messaging functionality for FlipNest

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

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
                <li class=;
