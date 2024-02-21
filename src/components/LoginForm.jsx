import { useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import LOGIN from '../graphql/mutations/login'
import { useNavigate } from 'react-router-dom'

const LoginForm = ({setError, setToken}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const [login, result] = useMutation(LOGIN, {
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
        },
        onCompleted: (data) => {
            if(data && data.login) {
                const authToken = data.login.value
                setToken(authToken)
                localStorage.setItem('library-user-token', authToken)
                navigate('/')
            }
        }
    })

    useEffect(() => {
        if (result.data && result.data.login) {
            const token = result.data.login.value
            localStorage.setItem('library-user-token', token)
         }
    }, [result.data])

    const submit = async (e) => {
        e.preventDefault()

        login({ variables: {username, password} })
        setUsername('')
        setPassword('')
    }

  return (
    <div>
        <form onSubmit={submit}>
            <div>
                username
                <input 
                value={username}
                onChange={({target}) => setUsername(target.value)}
                />
            </div>

            <div>
                password
                <input 
                value={password}
                onChange={({target}) => setPassword(target.value)}
                />
            </div>

            <button type="submit">login</button>
        </form>
    </div>
  )
}

export default LoginForm