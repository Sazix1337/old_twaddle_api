import WebSocket from 'ws';
import $endpoint from './exports/twaddle_endpoints'
import $posts from './posts/post'

const socket: WebSocket = new WebSocket('ws://176.113.82.87:8765')
const xor = require('xor-crypt')

abstract class TwaddlePoints {
    public static $send_message: void;
    public static $login: void;
}

socket.on('open', () => {
    console.log('Twaddle WebSocket started.')
})

socket.on('message', (data) => {
    console.log(`Data:`, data.toString())
})

const randomKey = Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9)
global.commands = []
global.botToken = []
global.prefix = []

class Twaddle implements TwaddlePoints {
    constructor() {
        return {
            $login: Twaddle.$login
        }
    }

    public static async $login(username: string, password: string) {
        const response: any = await $posts.send_request('http://176.113.82.87/api/accounts.login', {
            username,
            password
        })

        if (response["error"]) {
            throw new Error(`Error has occured! Error code: ${response["error"]}.`)
        }
        const $emitToken = response.data

        const token = response.data["token"]
        interface CollectionOption {
            botToken: string,
            prefix: string,
            commands: Array<string>
        }

        socket.send(JSON.stringify($emitToken))

        return {
            $token: token,
            $_CreateCollection (options?: CollectionOption) {
                const commands = options["commands"]
                const prefix = options["prefix"]
                const token = options["botToken"]
                global.commands.push(commands)
                global.botToken.push(token)
                global.prefix.push(prefix)
                return {
                    commands,
                    prefix,
                    token
                }
            },
            $_SelectCommand(command: string) {
                const commands = global.commands[0]

                const cmd = global.prefix.join('') + commands.find((c: any) => c === command).split(' ')

                if (cmd) {
                    return cmd
                } else {
                    throw new TypeError(`Command ${command} not identified. Please check your "commands" array in "CreateCollection" Object Data.`)
                }
            },
            async $_SendMessage(dialog_id: number, $tkn: any, $message: any) {
                const encrypt = (message, key) => {
                    const XOR = btoa(xor(message, key))
                    return XOR
                }

                const msg = await $posts.send_request('http://176.113.82.87/api/messages.send', {
                    token: $tkn,
                    encrypt_key: randomKey,
                    encrypted_text: encrypt($message, randomKey),
                    dialog_id: dialog_id,
                    attachments: []
                })

                return msg["data"]
            }
        }
    }
}
const clientPromise = Twaddle.$login('SaziX', '5d01d486');
const bot = async () => {
    const client = await clientPromise
    const token = client.$token
    client.$_CreateCollection({
        prefix: '$',
        botToken: client.$token,
        commands: [
            'ping'
        ]
    })

    const commands = {}
    const ping: any = client.$_SelectCommand('ping')
    commands[`${ping}`] = async () => {
        await client.$_SendMessage(8, client.$token, 'Pong')
    }

    commands[`${ping}`]()
}

bot()
export default Twaddle

