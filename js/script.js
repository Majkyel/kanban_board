'use strict;'

document.addEventListener('DOMContentLoaded', function () {

    var addColumnModal = document.getElementById('addColumnModal');
    var addCardModal = document.getElementById('addCardModal');
    var closeColumnModal = document.getElementsByClassName('close')[0];
    var closeCardModal = document.getElementsByClassName('close')[1];

    function randomString() {
        var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
        var str = '';
        for (var i = 0; i < 10; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    }

    function randomColorCard() {
        var colorTable = '0123456789abcdef';
        var colorTableLength = colorTable.length;
        var randomColor = '';
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 2; j++) {
                randomColor += colorTable[Math.floor(Math.random() * colorTableLength)];
            }
        }
        return randomColor;
    }

    function generateTemplate(name, data, basicElement) {
        var template = document.getElementById(name).innerHTML;
        var element = document.createElement(basicElement || 'div');
        Mustache.parse(template);
        element.innerHTML = Mustache.render(template, data);
        return element;
    }
    
    function showModal(modalAim, closeModal) {
        modalAim.style.display = 'block';
        closeModal.onclick = function () {
            modalAim.style.display = 'none';
        }
        window.onclick = function (event) {
            if (event.target === modalAim) {
                modalAim.style.display = 'none';
            }
        }
    }
    
    function Column(name) {
        var self = this;
        this.id = randomString();
        this.name = name;
        this.element = generateTemplate('column-template', {name: this.name, id: this.id});
        this.element.querySelector('.column').addEventListener('click', function (event) {
            if (event.target.classList.contains('btn-delete')) {
                self.removeColumn();
            }
            if (event.target.classList.contains('add-card')) {
                showModal(addCardModal, closeCardModal);
                var modalCardButton = document.getElementById('card-button_ok');
                modalCardButton.onclick = function (event) {
                    var inputCard = document.getElementById('card-input');
                    var inputCardValue = inputCard.value;
                    self.addCard(new Card(inputCardValue));
                    addCardModal.style.display = 'none';
                    inputCard.value = '';
                }
            }
        });
    }

    Column.prototype = {
        addCard: function (card) {this.element.querySelector('ul').appendChild(card.element);},
        removeColumn: function () {this.element.parentNode.removeChild(this.element);}
    };

    function Card(description) {
        var self = this;
        this.id = randomString();
        this.description = description;
        if (description) {
            this.element = generateTemplate('card-template', {description: this.description}, 'li');
        } else if (description === '') {
            alert('You have to write something!');
        }
        this.element.querySelector('.card').style.backgroundColor = '#' + randomColorCard();
        this.element.querySelector('.card').addEventListener('click', function (event) {
            event.stopPropagation();
            if (event.target.classList.contains('btn-delete')) {
                self.removeCard();
            }
        });
    }

    Card.prototype = {
        removeCard: function () {this.element.parentNode.removeChild(this.element);}
    }

    var board = {
        name: 'Kanban Board',
        addColumn: function (column) {
            this.element.appendChild(column.element);
            initSortable(column.id);
        },
        element: document.querySelector('#board .column-container')
    };

    function initSortable(id) {
        var el = document.getElementById(id);
        var sortable = Sortable.create(el, {group: 'kanban', sort: true});
    }

    document.querySelector('#board .create-column').addEventListener('click', function () {
        showModal(addColumnModal, closeColumnModal);
    });

    document.getElementById('column-button_ok').addEventListener('click', function () {
        var inputColumn = document.getElementById('column-input');
        var inputColumnValue = inputColumn.value;
        if (inputColumnValue) {
            var column = new Column(inputColumnValue);
            board.addColumn(column);
            addColumnModal.style.display = 'none';
            inputColumn.value = '';
        } else if (inputColumnValue === '') {
            alert('You have to write something!');
        }
    });
    
    // CREATING COLUMNS
    var todoColumn = new Column('To do');
    var doingColumn = new Column('Doing');
    var doneColumn = new Column('Done');

    // ADDING COLUMNS TO THE BOARD
    board.addColumn(todoColumn);
    board.addColumn(doingColumn);
    board.addColumn(doneColumn);

    // CREATING CARDS
    var card1 = new Card('New task');
    var card2 = new Card('Create kanban boards');
    var card3 = new Card('Old task');
    var card4 = new Card('Prepare dinner');

    // ADDING CARDS TO COLUMNS
    todoColumn.addCard(card1);
    todoColumn.addCard(card4);
    doingColumn.addCard(card2);
    doneColumn.addCard(card3);

});
