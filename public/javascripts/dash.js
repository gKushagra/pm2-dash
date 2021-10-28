const domain = "http://localhost:9997/";

document.onreadystatechange = function (event) {
    console.log('Before window loads');
    if (document.readyState === 'complete') {
        if (!localStorage.getItem('X-PM2DASH-TOKEN')) {
            window.location.replace(domain + 'views/login');
        }
    }
};

window.onload = async function (event) {
    console.log("After window loads");

    const pm2Link = document.getElementById('pm2');
    const envarLink = document.getElementById('envar');
    const apacheLink = document.getElementById('apache');
    const logoutLink = document.getElementById('logout');
    const homeContainer = document.getElementById('home-content-container');
    var state = {
        apps: null,
        terminal_out: null,
    }

    const refreshPm2Data = async function () {
        setTimeout(async () => {
            await fetch(domain + 'api/v1/dash/pm2/apps')
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
                    state.apps = data;
                });
        }, 5000);
    }

    await refreshPm2Data();

    logoutLink.addEventListener('click', function (event) {
        console.log('Logout');
        localStorage.removeItem('X-PM2DASH-TOKEN');
        localStorage.clear();
        window.location.replace(domain + 'views/login');
    });

    pm2Link.addEventListener('click', function (event) {
        createTerminal();
        // console.log('pm2');
    });

    // TODO
    envarLink.addEventListener('click', function (event) {
        alert("Functionality not available right now.")
    });

    // TODO
    apacheLink.addEventListener('click', function (event) {
        alert("Functionality not available right now.")
    });

    const getDataFromAPI = async function (action, app) {
        let response = await fetch(domain + `api/v1/dash/pm2/${action}/${app}`);
        let tojson = await response.json();
        // console.log(tojson);
        state.terminal_out = tojson;
    }

    const createTerminal = function () {
        var terminalContainer = document.createElement('div');
        terminalContainer.id = `terminal`;
        homeContainer.appendChild(terminalContainer);

        var $ptty = $('#terminal').Ptty();

        // get all running apps, start/stop/reboot/remove app
        $ptty.register('command', {
            name: 'list',
            method: function (cmd) {
                cmd.out = state.apps;
                return cmd;
            },
            options: [],
            help: 'Show all running apps'
        });

        $ptty.register('command', {
            name: 'help',
            method: function (cmd) {
                cmd.out = commandsTable;
                return cmd;
            },
            options: [],
            help: 'Show list of commands for PM2'
        });

        $ptty.register('command', {
            name: 'start',
            method: function (cmd) {
                if (cmd.hasOwnProperty('-app')) {
                    cmd.out = `Starting ${cmd['-app']}`
                } else {
                    cmd.out = "Error: App name not specified."
                }
                return cmd;
            },
            options: ['-app'],
            help: 'Start an app'
        });

        $ptty.register('command', {
            name: 'stop',
            method: function (cmd) {
                if (cmd.hasOwnProperty('-app')) {
                    cmd.out = `Stopping ${cmd['-app']}`
                } else {
                    cmd.out = "Error: App name not specified."
                }
                return cmd;
            },
            options: ['-app'],
            help: 'Stop an app'
        });

        $ptty.register('command', {
            name: 'restart',
            method: function (cmd) {
                if (cmd.hasOwnProperty('-app')) {
                    cmd.out = `restarting ${cmd['-app']}`
                } else {
                    cmd.out = "Error: App name not specified."
                }
                return cmd;
            },
            options: ['-app'],
            help: 'Restart an app'
        });

        $ptty.register('command', {
            name: 'remove',
            method: function (cmd) {
                if (cmd.hasOwnProperty('-app')) {
                    cmd.out = `removing ${cmd['-app']}`
                } else {
                    cmd.out = "Error: App name not specified."
                }
                return cmd;
            },
            options: ['-app'],
            help: 'Remove an app'
        });

        $ptty.register('command', {
            name: 'logs',
            method: function (cmd) {
                if (cmd.hasOwnProperty('-app')) {
                    cmd.out = `getting logs for ${cmd['-app']}`
                } else {
                    cmd.out = "Error: App name not specified."
                }
                return cmd;
            },
            options: ['-app'],
            help: 'Show logs for app'
        });

        $ptty.register('command', {
            name: 'show',
            method: function (cmd) {
                state.terminal_out = null;
                if (cmd.hasOwnProperty('-app')) {
                    getDataFromAPI('show', cmd['-app'])
                    cmd.out = state.terminal_out;
                } else {
                    cmd.out = "Error: App name not specified.";
                    return cmd;
                }
                return cmd;
            },
            options: ['-app'],
            help: 'Show app info'
        });

        const commandsTable = `
        <table style="border: 1px solid white; border-collapse: collapse; width: 360px;">
        <tr><th style="border: 1px solid white;">Command</th>
        <th style="border: 1px solid white;">Description</th></tr>
        <tr><td style="border: 1px solid white;"><b>list</b></td>
        <td style="border: 1px solid white;">Show all apps</td></tr>
        <tr><td style="border: 1px solid white;"><b>start</b> <i>-app name/all</i></td>
        <td style="border: 1px solid white;">Start app</td></tr>
        <tr><td style="border: 1px solid white;"><b>stop</b> <i>-app name/all</i></td>
        <td style="border: 1px solid white;">Stop app</td></tr>
        <tr><td style="border: 1px solid white;"><b>restart</b> <i>-app name/all</i></td>
        <td style="border: 1px solid white;">Restart app</td></tr>
        <tr><td style="border: 1px solid white;"><b>remove</b> <i>-app name</i></td>
        <td style="border: 1px solid white;">Remove app</td></tr>
        <tr><td style="border: 1px solid white;"><b>logs</b> <i>-app name</i></td>
        <td style="border: 1px solid white;">Show logs for app</td></tr>
        <tr><td style="border: 1px solid white;"><b>show</b> <i>-app name</i></td>
        <td style="border: 1px solid white;">Show app info</td></tr>
        </table>
        `;
    }

    pm2Link.click(); // default to pm2 link;

}

/**
 *
 * Features
 *
 * Environment variables
 *  - overwrite .env
 *
 * PM2
 *  - pm2 status
 *  - pm2 stop
 *  - pm2 restart
 *  - pm2 delete
 *  - pm2 logs
 *
 * Apache
 *  - enable/disable conf
 *  - add/remove conf
 *
 */