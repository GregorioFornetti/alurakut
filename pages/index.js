import React from 'react'
import nookies from 'nookies'
import styled from 'styled-components'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import jwt from 'jsonwebtoken'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/components/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

function ProfileSidebar(props) {
  return (
    <Box>
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className='smallTitle'>
        {props.title}
      </h2>
      <ul>
        {props.createItens()}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

function RelationItem(props) {
  return (
    <li key={props.key}>
      <a href={props.link}>
        <img src={props.image} />
        <span>{props.title}</span>
      </a>
    </li>
  )
}

export default function Home(props) {

  const router = useRouter();
  React.useState();
  const githubUser = props.githubUser
  const [comunidades, setComunidades] = React.useState([])
  const friends = [
    'peas',
    'juunegreiros',
    'omariosouto',
    'gustavoguanabara',
    'filipedeschamps',
    'steppat',
    'GregorioFornetti'
  ]
  const [seguidores, setSeguidores] = React.useState([])

  React.useEffect(() => {
    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then((response) => response.json())
      .then((data) => { setSeguidores(data) })
  }, [])

  React.useEffect(() => {
    fetch('/api/comunidades')
    .then((response) => response.json())
    .then((data) => { setComunidades(data) })
  }, [])

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style= {{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className='title'>Bem vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que voc?? deseja fazer ?</h2>
            <form onSubmit={(event) => {
              event.preventDefault();
              const dados = new FormData(event.target)
              setComunidades([...comunidades, {
                'id' : new Date().toISOString(),
                'link': dados.get('link'),
                'title': dados.get('title'),
                'image': dados.get('image')
              }])
              fetch('/api/cadastro_comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  'title': dados.get('title'),
                  'imageUrl':dados.get('image'),
                  'pageUrl':dados.get('link')
                })
              })
              .then(async (response) => {
                const dados = response.json()
                console.log(dados)
              })
            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type='text'
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                  type='text'
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para a comunidade"
                  name="link"
                  aria-label="Coloque uma URL para a comunidade"
                  type='text'
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title={`Pessoas da comunidade (${friends.length})`} createItens={() => {
            return friends.slice(0, 6).map((itemAtual) => {
              return <RelationItem key={itemAtual} link={`/users/${itemAtual}`}
               image={`https://github.com/${itemAtual}.png`} title={itemAtual}/>
            })
          }} />

          <ProfileRelationsBox title={`Comunidades (${comunidades.length})`} createItens={() => {
            return comunidades.slice(0, 6).map((itemAtual) => {
              return <RelationItem key={itemAtual.title} link={itemAtual.link}
               image={itemAtual.image} title={itemAtual.title}/>
            })
          }} />

          <ProfileRelationsBox title={`Seguidores (${seguidores.length})`} createItens={() => {
            return seguidores.slice(0, 6).map((itemAtual) => {
              return <RelationItem key={itemAtual.id} link={`https://github.com/${itemAtual.login}`} 
                image={itemAtual.avatar_url} title={itemAtual.login}/>
            })
          }} />
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {

  const token = nookies.get(context).USER_TOKEN
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
  .then((response) => response.json())

  console.log(isAuthenticated)
  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  return {
    props: {
      githubUser: jwt.decode(token).githubUser
    }
  }
}