'use strict';

class Todo {
	constructor(form, input, todoList, todoCompleted){
		this.form = document.querySelector(form);
		this.input = document.querySelector(input);
		this.todoList = document.querySelector(todoList);
		this.todoCompleted = document.querySelector(todoCompleted);
		this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
	}

	addToStorage(){
		localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
	}

	render(){
		this.input.value = '';
		this.todoList.textContent = '';
		this.todoCompleted.textContent = '';
		this.todoData.forEach(this.createItem, this);
		this.addToStorage();
	}

	createItem(item){
		const li = document.createElement('li');
		li.classList.add('todo-item');
		li.innerHTML = `
			<span class="text-todo">${item.value}</span>
			<div class="todo-buttons">
			<button class="todo-edit"></button>
			<button class="todo-remove"></button>
			<button class="todo-complete"></button>
			</div>`;
		if (item.completed) {
			this.todoCompleted.append(li);
			} else {
				this.todoList.append(li);
			}
		}

	addTodo(event){
		event.preventDefault();
		if(this.input.value.trim() !== ''){
			this.input.style.border = '0';
			const newTodo = {
				value: this.input.value,
				completed: false,
				key: this.generateKey(),
			}
			this.todoData.set(newTodo.key, newTodo);
		}else {
			this.input.style.border = '2px solid';
			this.input.style.borderColor = 'red';
			alert('Заполните пожалуйста поле!');
		}
		this.render();
	}

	generateKey(){
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}

	getItem(target, classItem, idBtn){
		let count =0;
		const todoItem = document.querySelectorAll('.todo-item');
		todoItem.forEach((item) => {
			const btn = item.querySelector(classItem);
			if(btn === target){
				if(idBtn === 0){
					this.animeDel(count, item);
				} 
				if(idBtn === 1){
					this.animeCompl(count, item);
				} 
				if(idBtn === 2){
					const span = item.querySelector('.text-todo');
					span.setAttribute('contenteditable','false');
					this.editItem(item, span);
				}
			}
		});
	}
		
	animeDel(count, item)	{
		let requestId = requestAnimationFrame(() =>{
			this.animeDel(count, item);
		});
		count += 20;
		item.style.position = 'relative';
		item.style.left = count + 'px';
		if (count > 700) {
			count = 0;
			cancelAnimationFrame(requestId);
			this.deleteItem(item);
		}
	}

	animeCompl(count, item){
		let requestId = requestAnimationFrame(() =>{
			this.animeCompl(count, item);
		});
		count += 20;
		item.style.position = 'relative';
		item.style.opacity = 1 - 0.001*(count);
		if(item.style.opacity < 0){
			count = 0;
			item.style.opacity = 0 + 0.001*(count);
			this.completedItem(item);
			cancelAnimationFrame(requestId);
		}
	}

	deleteItem(item){
		this.todoData.forEach((elem, index) => {
			if(elem.value === item.textContent.trim()){
				this.todoData.delete(elem.key);
			}
		});
		this.render();
	}

	completedItem(item){
		this.todoData.forEach((elem) => {
			if(elem.value === item.textContent.trim()){
				elem.completed = !elem.completed;
			}
		});
		this.render();
	}

	editItem(item, span){
		this.todoData.forEach((elem) => {
			if(elem.value === item.textContent.trim()){
				span.setAttribute('contenteditable','true');
				span.addEventListener('input', () => {
					elem.value = span.textContent;
					this.addToStorage();
				});
			}
		});
	}

	handler(){
		const todoContainer = document.querySelector('.todo-container');
		todoContainer.addEventListener('click', (event) => {
			let target = event.target;
			if(target.matches('.todo-remove')){
				this.getItem(target, '.todo-remove', 0);
			}
			if(target.matches('.todo-complete')){
				this.getItem(target, '.todo-complete', 1);
			}
			if(target.matches('.todo-edit')){
				this.getItem(target, '.todo-edit', 2);
			}
		});
	}

	init(){
		this.form.addEventListener('submit', this.addTodo.bind(this));
		this.render();
		this.handler();
	}
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
todo.init();