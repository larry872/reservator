import axios from 'axios'

const headers = {
  authorization: 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
  'Cache-Control': 'no-cache',
  'content-type': 'application/x-www-form-urlencoded',
}

interface AuthResponse {
  token: string
  payment_method_id: number
}

async function login(
  username: string,
  password: string
): Promise<[string, string]> {
  const data = {
    email: username,
    password: password,
  }

  const response = await axios.post<AuthResponse>(
    'https://api.resy.com/3/auth/password',
    data,
    { headers }
  )
  const resData = response.data
  const auth_token = resData.token
  const payment_method_string = `{"id":${resData.payment_method_id}}`
  return [auth_token, payment_method_string]
}

function readConfig(): [string, string, string, string, string] {
  const fs = require('fs')
  const dat = fs.readFileSync('requests.config', 'utf8').split('\n')
  return dat.map((k) => k.split(':')[1].trim()) as [
    string,
    string,
    string,
    string,
    string
  ]
}

async function main() {
  const [username, password, venue, date, guests] = readConfig()
  let auth_token: string
  let payment_method_string: string

  try {
    const [token, paymentMethod] = await login(username, password)
    auth_token = token
    payment_method_string = paymentMethod
    console.log(
      'Logged in successfully - disown this task and allow it to run in the background'
    )
  } catch (error) {
    console.error('Error:', error)
  }
}

main()
