const { default: axios } = require('axios')

const $posts = {
    send_request(url: string, data?: Object) {
        return new Promise((resolve, reject) => {
            axios.post(url, data).then((response: any) => {
                resolve(response)
            })
        })
    }
}

export default $posts
