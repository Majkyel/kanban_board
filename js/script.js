'use strict;'

document.addEventListener('DOMContentLoaded', function () {

    var addColumnModal = document.getElementById('AddColumnModal');
    var addCardModal = document.getElementById('AddCardModal');
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
    randomColorCard();

    function generateTemplate(name, data, basicElement) {
        var template = document.getElementById(name).innerHTML;
        var element = document.createElement(basicElement || 'div');
        Mustache.parse(template);
        element.innerHTML = Mustache.render(template, data);
        return element;
    }

    function Column(name) {

        var self = this;
        this.id = randomString();
        this.name = name;

        this.element = generateTemplate('column-template', {
            name: this.name,
            id: this.id
        });

        this.element.querySelector('.column').addEventListener('click', function (event) {

            if (event.target.classList.contains('btn-delete')) {
                self.removeColumn();
            }
            if (event.target.classList.contains('add-card')) {

                addCardModal.style.display = 'block';

                closeCardModal.onclick = function () {
                    addCardModal.style.display = 'none';
                }
                window.onclick = function (event) {
                    if (event.target === addCardModal) {
                        addCardModal.style.display = 'none';
                    }
                }

                document.getElementById('cardButtonOk').addEventListener('click', function () {

                    var inputCard = document.getElementById('cardInput');
                    var inputCardValue = inputCard.value;

                    if (inputCardValue !== '' && inputCardValue !== null) {

                        self.addCard(new Card(inputCardValue));
                        addCardModal.style.display = 'none';
                        inputCard.value = '';

                    } else if (inputCardValue === '') {
                        alert('You have to write something!');
                    }
                });
            }
        });
    }

    Column.prototype = {
        addCard: function (card) {
            this.element.querySelector('ul').appendChild(card.element);
        },
        removeColumn: function () {
            this.element.parentNode.removeChild(this.element);
        }
    };

    function Card(description) {

        var self = this;
        this.id = randomString();
        this.description = description;

        if (description !== null && description !== '') {
            this.element = generateTemplate('card-template', {
                description: this.description
            }, 'li');
        } else if (description === null) {
            alert('No problem :)');
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
        removeCard: function () {
            this.element.parentNode.removeChild(this.element);
        }
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
        var sortable = Sortable.create(el, {
            group: 'kanban',
            sort: true
        });
    }

    document.querySelector('#board .create-column').addEventListener('click', function () {

        addColumnModal.style.display = 'block';

        closeColumnModal.onclick = function () {
            addColumnModal.style.display = 'none';
        }
        window.onclick = function (event) {
            if (event.target === addColumnModal) {
                addColumnModal.style.display = 'none';
            }
        }
    });

    document.getElementById('columnButtonOk').addEventListener('click', function () {

        var inputColumn = document.getElementById('columnInput');
        var inputColumnValue = inputColumn.value;

        if (inputColumnValue !== '' && inputColumnValue !== null) {

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
