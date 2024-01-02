const searchVideo = async (url) => {
    let endpoint = 'http://localhost:8080/audio/'

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    })

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
}

const displayVideoCard = (videoData) => {
    const url = videoData.video_url

    const cardContainer = document.createElement('div')
    cardContainer.className = 'card-container'
    cardContainer.style.background = 'white'

    const videoTitle = document.createElement('h2')
    videoTitle.textContent = videoData.title

    const videoThumbnail = document.createElement('img')
    videoThumbnail.src = videoData.thumbnails[0].url

    const downloadButton = document.createElement('button')
    downloadButton.textContent = 'Descargar MP3'

    downloadButton.addEventListener('click', async () => {
        fetch('http://localhost:8080/audio/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        })
            .then(response => {
                if (response.ok) {
                    return response.blob()
                } else {
                    throw new Error('Error al obtener el archivo.')
                }
            })
            .then(blob => {
                // Crear un objeto URL a partir del blob
                const url = URL.createObjectURL(blob)

                // Crear un enlace y hacer que se descargue automáticamente
                const a = document.createElement('a')
                a.style.display = 'none'
                a.href = url
                a.download = `${videoData.title}.mp3`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url) // Liberar el objeto URL
            })
            .catch(error => {
                console.error('Hubo un error:', error)
                window.alert('Hubo un error al descargar el archivo.')
            })
    })
    
    cardContainer.appendChild(videoTitle)
    cardContainer.appendChild(videoThumbnail)
    cardContainer.appendChild(downloadButton)

    const videoContainer = document.getElementById('videoContainer')

    videoContainer.appendChild(cardContainer)
}

document.getElementById('searchForm').addEventListener('submit', async function (event) {
    event.preventDefault()
    const url = document.getElementById('urlInput').value
    if (!url) {
        window.alert('Por favor, introduce una URL válida.')
        return
    }
    const res = await searchVideo(url)

    displayVideoCard(res)
})
