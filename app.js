document.addEventListener("DOMContentLoaded", () => {
    let main  = document.querySelector("main")
    let contactForm = document.getElementById("contact-form");
            let nameInput = document.getElementById("name-input");
            let phoneInput = document.getElementById("phone-input");
            let searchInput = document.getElementById("search-input");
            let contactList = document.getElementById("contact-list");
            let submissionOverlay = document.getElementById("submission-overlay");
            let totalNumbers = document.getElementById("total-numbers");
            let favoriteList = document.getElementById('favorite-list');

    let contacts = [
        { id: 1, name: "Alice Johnson", phones: ["123-456-7890"], favorite: false, new: false },
        { id: 2, name: "Bob Smith", phones: ["987-654-3210"], favorite: false, new: false }
    ];
    let phoneInputs = [phoneInput];

    let audio = new Audio("submit-sound.mp3");

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let phones = phoneInputs.map(input => input.value).filter(value => value);
        addContact(nameInput.value, phones);
        nameInput.value = "";
        phoneInputs.forEach(input => input.value = "");
        renderContacts();
        showSubmissionOverlay();
        playSubmitSound();
        updateTotalNumbers();
    });



    searchInput.addEventListener("input", () => {
        renderContacts();
    });

    function renderContacts() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredContacts = contacts.filter(contact => 
            contact.name.toLowerCase().includes(searchTerm)
        );

        contactList.innerHTML = '';
        filteredContacts.forEach(contact => {
            if (!contact.favorite) {
                contactList.appendChild(createContactItem(contact));
            }
        });

        favoriteList.innerHTML = '';
        filteredContacts.forEach(contact => {
            if (contact.favorite) {
                favoriteList.appendChild(createContactItem(contact));
            }
        });
    }

    function createContactItem(contact) {
        const contactItem = document.createElement('li');
        contactItem.classList.add('contact-item');
        if (contact.new) {
            contactItem.classList.add('new');
        }
        contactItem.draggable = true;
        contactItem.dataset.id = contact.id;
        contactItem.innerHTML = `
            <span>${contact.name} - ${contact.phones.join(', ')}</span>
            <div class="contact-actions">
                <button class="favorite">${contact.favorite ? '★' : '☆'}</button>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;

        // Drag events
        contactItem.addEventListener('dragstart', handleDragStart);
        contactItem.addEventListener('dragover', handleDragOver);
        contactItem.addEventListener('drop', handleDrop);
        contactItem.addEventListener('dragend', handleDragEnd);

        return contactItem;
    }

    function addContact(name, phones) {
        let newContact = {
            id: Date.now(),
            name,
            phones,
            favorite: false,
            new: true
        };
        contacts.push(newContact);
        setTimeout(() => {
            newContact.new = false;
            renderContacts();
        }, 5000);
    }

    [contactList, favoriteList].forEach(list => {
        list.addEventListener('click', (e) => {
            const id = e.target.closest('.contact-item').dataset.id;
            if (e.target.classList.contains('edit')) {
                editContact(id);
            } else if (e.target.classList.contains('delete')) {
                deleteContact(id);
            } else if (e.target.classList.contains('favorite')) {
                toggleFavorite(id);
            }
        });
    });

    function editContact(id) {
        let contact = contacts.find(contact => contact.id == id);
        let newName = prompt("Enter new name:", contact.name);
        let newPhones = prompt("Enter new phones :", contact.phones.join(", ")).split(",").map(phone => phone.trim());
        if (newName && newPhones.length) {
            contact.name = newName;
            contact.phones = newPhones;
            renderContacts();
            updateTotalNumbers();
        }
    }
    function deleteContact(id) {
        contacts = contacts.filter(contact => contact.id != id);
        renderContacts();
        updateTotalNumbers();
    }
    function toggleFavorite(id) {
        const contact = contacts.find(contact => contact.id == id);
        contact.favorite = !contact.favorite;
        renderContacts();
    }

    function showSubmissionOverlay() {
        submissionOverlay.classList.add("show");
        setTimeout(() => {
            submissionOverlay.classList.remove("show");
        }, 2000);
    }

    function playSubmitSound() {
        audio.play();
    }

    function updateTotalNumbers() {
        let total = 0;
        for (const contact of contacts) {
            total += contact.phones.length;
        }
        // console.log(total);
        totalNumbers.textContent = total;
    }
    let draggedItem = null;

    function handleDragStart(e) {
        draggedItem = e.target;
        setTimeout(() => {
            e.target.classList.add("dragging");
        }, 0);
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        let target = e.target.closest(".contact-item");
        if (target) {
            if (target !== draggedItem) {
                contactList.insertBefore(draggedItem, target.nextSibling);
            }
        }
    }
    
    function handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove("dragging");
    }
    
    function handleDragEnd(e) {
        e.target.classList.remove("dragging");
        let contactItems = Array.from(contactList.children);
let reorderedContacts = contactItems.map(item => {
    let contactId = Number(item.dataset.id); 
    return contacts.find(contact => contact.id === contactId); 
});
        contacts = reorderedContacts;
    }

    document.addEventListener("mousemove", (e) => {
        let moveX = (e.clientX / window.innerWidth) * 100;
        let moveY = (e.clientY / window.innerHeight) * 100;
        main.style.backgroundPosition = `${moveX}% ${moveY}%`;
    });

    renderContacts();
    updateTotalNumbers();

})