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
        terminal_out: null,
    }

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

    const createTerminal = function () {
        var terminalContainer = document.createElement('div');
        terminalContainer.id = `terminal`;
        homeContainer.appendChild(terminalContainer);

        var $ptty = $('#terminal').Ptty();

        const getAppsFromAPI = async function () {
            let response = await fetch(domain + `api/v1/dash/pm2/apps`);
            if (response.status === 500) {
                alert("Sorry! The server encountered an error");
                return;
            }
            let tojson = await response.json();
            // console.log(tojson);
            state.terminal_out = tojson;
            updateCmdOut(tojson);
        }

        const getDataFromAPI = async function (action, app) {
            let response = await fetch(domain + `api/v1/dash/pm2/${action}/${app}`);
            if (response.status === 500) {
                alert("Sorry! The server encountered an error");
                return;
            }
            let tojson = await response.json();
            // console.log(tojson);
            state.terminal_out = tojson;
            updateCmdOut(tojson);
        }

        const updateCmdOut = function (stdout) {
            document.querySelector('.content').lastChild.querySelector('.cmd_out').innerText = stdout;
        }

        // get all running apps, start/stop/reboot/remove app
        $ptty.register('command', {
            name: 'list',
            method: function (cmd) {
                getAppsFromAPI();
                cmd.out = "Please wait...";
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
                    getDataFromAPI('start', cmd['-app'])
                    cmd.out = "Please wait...";
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
                    getDataFromAPI('stop', cmd['-app'])
                    cmd.out = "Please wait...";
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
                    getDataFromAPI('restart', cmd['-app'])
                    cmd.out = "Please wait...";
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
                    getDataFromAPI('delete', cmd['-app'])
                    cmd.out = "Please wait...";
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
                    getDataFromAPI('logs', cmd['-app'])
                    cmd.out = "Please wait...";
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
                    cmd.out = "Please wait...";
                } else {
                    cmd.out = "Error: App name not specified.";
                }
                return cmd;
            },
            options: ['-app'],
            help: 'Show app info'
        });

        $ptty.register('command', {
            name: 'out',
            method: function (cmd) {
                cmd.out = state.terminal_out;
                return cmd;
            },
            help: 'Show output'
        });

        const commandsTable = `
        <table style="border: 1px solid #00c853; border-collapse: collapse; width: 360px;">
        <tr><th style="border: 1px solid #00c853;">Command</th>
        <th style="border: 1px solid #00c853;">Description</th></tr>
        <tr><td style="border: 1px solid #00c853;"><b>list</b></td>
        <td style="border: 1px solid #00c853;">Show all apps</td></tr>
        <tr><td style="border: 1px solid #00c853;"><b>start</b> <i>-app name/all</i></td>
        <td style="border: 1px solid #00c853;">Start app</td></tr>
        <tr><td style="border: 1px solid #00c853;"><b>stop</b> <i>-app name/all</i></td>
        <td style="border: 1px solid #00c853;">Stop app</td></tr>
        <tr><td style="border: 1px solid #00c853;"><b>restart</b> <i>-app name/all</i></td>
        <td style="border: 1px solid #00c853;">Restart app</td></tr>
        <tr><td style="border: 1px solid #00c853;"><b>remove</b> <i>-app name</i></td>
        <td style="border: 1px solid #00c853;">Remove app</td></tr>
        <tr><td style="border: 1px solid #00c853;"><b>logs</b> <i>-app name</i></td>
        <td style="border: 1px solid #00c853;">Show logs for app</td></tr>
        <tr><td style="border: 1px solid #00c853;"><b>show</b> <i>-app name</i></td>
        <td style="border: 1px solid #00c853;">Show app info</td></tr>
        </table>
        `;
    }

    pm2Link.click(); // default to pm2 link;

}