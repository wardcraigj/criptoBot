// 'use strict';
const electron = require('electron');

const {app, BrowserWindow, Menu} = electron;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

const path = require('path');
const url = require('url');

var env = require('node-env-file');
env('.env');
var priceService = new (require('./js/services/price-service').PriceService)();
priceService.populateHistoricalPrices();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 600,
		height: 400
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	// Build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	// Insert Menu
	Menu.setApplicationMenu(mainMenu);
	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

function createAddWindow() {
	// Create new window
	addWindow  = new BrowserWindow({
		width: 400,
		height: 300,
		title:'Add Configuration'
	});
	// Load html into window
	addWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'addConfiguration.html'),
		protocol:'file',
		slashes:true
	}));
}

function realtimePriceLoop () {

	var frequency = 60 * 1000;
	
	console.log('running background fetch');
	priceService.fetchCurrentPrices();

	setTimeout(realtimePriceLoop, frequency);
}

app.on('ready', ()=> {

	realtimePriceLoop();
});

const mainMenuTemplate = [
	{
		label:'CryptoBot',
		submenu:[
			{
				label: 'Add Configuration',
				click(){
					createAddWindow();
				}
			},
			{
				label: 'Show Configuration'
			},
			{
				label:'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click(){
					app.quit();
				}
			}
		]
	}
];


