import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: No se encontraron las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY')
    console.error('Asegúrate de que el archivo .env existe y contiene estas variables.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Nombres españoles realistas
const nombres = ['Carlos', 'María', 'Javier', 'Laura', 'Pablo', 'Ana', 'Diego', 'Carmen', 'Alberto', 'Lucía',
    'Miguel', 'Elena', 'Sergio', 'Marta', 'David', 'Cristina', 'Raúl', 'Patricia', 'Jorge', 'Isabel',
    'Antonio', 'Sara', 'Francisco', 'Beatriz', 'Juan', 'Rosa', 'Luis', 'Silvia', 'Pedro', 'Nuria']

const apellidos = ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez',
    'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Álvarez', 'Muñoz',
    'Romero', 'Alonso', 'Gutiérrez', 'Navarro', 'Torres', 'Domínguez', 'Vázquez', 'Ramos']

// Barrios de Madrid con coordenadas aproximadas
const barriosMadrid = [
    { nombre: 'Malasaña', lat: 40.4258, lng: -3.7044, zona: 'Centro' },
    { nombre: 'Chueca', lat: 40.4230, lng: -3.6957, zona: 'Centro' },
    { nombre: 'Lavapiés', lat: 40.4088, lng: -3.7011, zona: 'Centro' },
    { nombre: 'Salamanca', lat: 40.4300, lng: -3.6750, zona: 'Este' },
    { nombre: 'Chamberí', lat: 40.4372, lng: -3.7022, zona: 'Norte' },
    { nombre: 'Chamartín', lat: 40.4650, lng: -3.6778, zona: 'Norte' },
    { nombre: 'Moncloa', lat: 40.4365, lng: -3.7187, zona: 'Oeste' },
    { nombre: 'Argüelles', lat: 40.4325, lng: -3.7178, zona: 'Oeste' },
    { nombre: 'Retiro', lat: 40.4153, lng: -3.6824, zona: 'Este' },
    { nombre: 'La Latina', lat: 40.4088, lng: -3.7115, zona: 'Centro' },
    { nombre: 'Usera', lat: 40.3897, lng: -3.7026, zona: 'Sur' },
    { nombre: 'Vallecas', lat: 40.3842, lng: -3.6526, zona: 'Sur' },
    { nombre: 'Carabanchel', lat: 40.3850, lng: -3.7392, zona: 'Sur' },
    { nombre: 'Tetuán', lat: 40.4650, lng: -3.6978, zona: 'Norte' },
    { nombre: 'Ciudad Universitaria', lat: 40.4458, lng: -3.7305, zona: 'Oeste' }
]

const calles = ['Calle de Atocha', 'Calle Mayor', 'Gran Vía', 'Calle de Alcalá', 'Calle Fuencarral',
    'Calle Princesa', 'Paseo de la Castellana', 'Calle Serrano', 'Calle Goya', 'Calle Bravo Murillo',
    'Calle de Hortaleza', 'Calle Preciados', 'Calle Toledo', 'Calle Amaniel', 'Calle San Bernardo']

const ocupaciones = ['student', 'professional', 'remote', 'other']
const mascotasOpciones = ['no', 'cats', 'dogs', 'all']

const bioPlantillas = [
    'Hola! Soy {nombre}, estudiante de {carrera}. Me encanta {hobby} y busco un ambiente tranquilo para estudiar.',
    'Profesional de {profesion}, trabajando en {sector}. Busco compañeros respetuosos y con buen rollo.',
    'Trabajo en remoto como {profesion}. Me gusta {hobby} y cocinar. Busco un ambiente relajado.',
    'Estudiante de {carrera} en la Universidad Complutense. Fan del {deporte} y la música. Muy sociable!',
    'Hola! Tengo {edad} años, trabajo en {sector}. Me encanta {hobby} y los planes tranquilos.',
    'Busco piso compartido. Soy {profesion}, ordenado/a y respetuoso/a. Me gusta {hobby}.'
]

const carreras = ['Medicina', 'Ingeniería', 'Derecho', 'Economía', 'Arquitectura', 'Psicología', 'Periodismo', 'Informática']
const profesiones = ['diseñador', 'programador', 'consultor', 'ingeniero', 'arquitecto', 'profesor', 'traductor', 'fotógrafo']
const sectores = ['tecnología', 'consultoría', 'educación', 'marketing', 'finanzas', 'salud', 'creatividad']
const hobbies = ['el cine', 'la música', 'el deporte', 'viajar', 'la cocina', 'el arte', 'la lectura', 'el yoga']
const deportes = ['fútbol', 'baloncesto', 'running', 'ciclismo', 'natación', 'escalada']

function random(array) {
    return array[Math.floor(Math.random() * array.length)]
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function generarNombre() {
    return `${random(nombres)} ${random(apellidos)} ${random(apellidos)}`
}

function generarBio(nombre) {
    const plantilla = random(bioPlantillas)
    return plantilla
        .replace('{nombre}', nombre.split(' ')[0])
        .replace('{carrera}', random(carreras))
        .replace('{profesion}', random(profesiones))
        .replace('{sector}', random(sectores))
        .replace('{hobby}', random(hobbies))
        .replace('{deporte}', random(deportes))
        .replace('{edad}', randomInt(22, 35))
}

function generarDireccion() {
    const barrio = random(barriosMadrid)
    const calle = random(calles)
    const numero = randomInt(1, 150)

    // Añadir variación pequeña a las coordenadas
    const latVariacion = (Math.random() - 0.5) * 0.02
    const lngVariacion = (Math.random() - 0.5) * 0.02

    return {
        address: `${calle} ${numero}, ${barrio.nombre}, Madrid`,
        latitude: barrio.lat + latVariacion,
        longitude: barrio.lng + lngVariacion,
        barrio: barrio.nombre
    }
}

function generarEmail(nombre, index) {
    const nombreLimpio = nombre.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quitar acentos
        .replace(/\s+/g, '.')
    return `${nombreLimpio}.${index}@roomatch.test`
}

// Crear 100 seekers
async function crearSeekers() {
    console.log('Creando 100 seekers en Madrid...')

    for (let i = 0; i < 100; i++) {
        const nombre = generarNombre()
        const email = generarEmail(nombre, i)
        const password = 'Test123!' // Contraseña estándar para testing

        try {
            // Crear usuario en Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
            })

            if (authError) {
                console.error(`Error creando auth para ${nombre}:`, authError.message)
                continue
            }

            const userId = authData.user.id

            // Crear perfil
            const ubicacion = generarDireccion()

            const { error: profileError } = await supabase.from('users').insert({
                id: userId,
                email: email,
                full_name: nombre,
                role: 'seeker',
                bio: generarBio(nombre),
                preferences: {
                    budget_max: randomInt(400, 900),
                    smoker: Math.random() > 0.7,
                    pets: random(mascotasOpciones),
                    occupation: random(ocupaciones),
                    search_radius: randomInt(5, 25),
                    location: {
                        latitude: ubicacion.latitude,
                        longitude: ubicacion.longitude,
                        address: ubicacion.address
                    },
                    lifestyle: {
                        cleanliness: randomInt(1, 5),
                        schedule: randomInt(1, 5),
                        social: randomInt(1, 5),
                        guests: randomInt(1, 5)
                    }
                }
            })

            if (profileError) {
                console.error(`Error creando perfil para ${nombre}:`, profileError.message)
            } else {
                console.log(`✓ Seeker ${i + 1}/100: ${nombre} - ${ubicacion.barrio}`)
            }

        } catch (error) {
            console.error(`Error general con ${nombre}:`, error.message)
        }

        // Pequeña pausa para no saturar la API
        await new Promise(resolve => setTimeout(resolve, 100))
    }
}

// Crear 20 listings (hosts)
async function crearListings() {
    console.log('\nCreando 20 alojamientos en Madrid...')

    const tiposHabitacion = [
        'Habitación luminosa en piso compartido',
        'Habitación individual amueblada',
        'Habitación doble con vistas',
        'Habitación en piso céntrico',
        'Habitación en ático',
        'Habitación con balcón',
        'Habitación amplia con escritorio',
        'Habitación en piso renovado'
    ]

    for (let i = 0; i < 20; i++) {
        const nombre = generarNombre()
        const email = generarEmail(nombre, 100 + i) // Offset para evitar duplicados
        const password = 'Test123!'

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
            })

            if (authError) {
                console.error(`Error creando auth para host ${nombre}:`, authError.message)
                continue
            }

            const userId = authData.user.id

            // Crear perfil de host
            const { error: profileError } = await supabase.from('users').insert({
                id: userId,
                email: email,
                full_name: nombre,
                role: 'host',
                bio: `Propietario/a de piso en Madrid. Busco compañero/a de piso responsable y respetuoso/a.`
            })

            if (profileError) {
                console.error(`Error creando perfil host:`, profileError.message)
                continue
            }

            // Crear listing
            const ubicacion = generarDireccion()
            const precio = randomInt(350, 750)
            const size = randomInt(10, 25)

            const descripciones = [
                `Habitación ${size}m² en ${ubicacion.barrio}. Piso tranquilo y bien comunicado. Cerca de metro y autobús.`,
                `Alquilo habitación en ${ubicacion.barrio}. Zona muy bien conectada, supermercados cerca. Ambiente agradable.`,
                `Habitación disponible en piso compartido en ${ubicacion.barrio}. Ideal para estudiantes o profesionales.`,
                `Se alquila habitación amueblada en ${ubicacion.barrio}. Piso luminoso con todas las comodidades.`
            ]

            const { error: listingError } = await supabase.from('listings').insert({
                host_id: userId,
                title: `${random(tiposHabitacion)} en ${ubicacion.barrio}`,
                description: random(descripciones),
                price: precio,
                address: ubicacion.address,
                latitude: ubicacion.latitude,
                longitude: ubicacion.longitude,
                location: ubicacion.barrio,
                available_from: new Date(Date.now() + randomInt(0, 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                min_stay_months: randomInt(3, 12),
                features: {
                    size_m2: size,
                    wifi: Math.random() > 0.1,
                    ac: Math.random() > 0.5,
                    heating: Math.random() > 0.2,
                    furnished: Math.random() > 0.3,
                    elevator: Math.random() > 0.4,
                    dishwasher: Math.random() > 0.5,
                    private_bath: Math.random() > 0.7
                },
                rules: {
                    smoking_allowed: Math.random() > 0.8,
                    pets_allowed: random(['no', 'no', 'no', 'cats', 'all']),
                    visitors_allowed: random(['yes', 'yes', 'weekends', 'no'])
                }
            })

            if (listingError) {
                console.error(`Error creando listing:`, listingError.message)
            } else {
                console.log(`✓ Listing ${i + 1}/20: ${ubicacion.barrio} - ${precio}€/mes`)
            }

        } catch (error) {
            console.error(`Error general con host:`, error.message)
        }

        await new Promise(resolve => setTimeout(resolve, 100))
    }
}

async function main() {
    console.log('=== GENERADOR DE DATOS DE PRUEBA - ROOMATCH MADRID ===\n')

    await crearSeekers()
    await crearListings()

    console.log('\n✅ Proceso completado!')
    console.log('📊 Resumen:')
    console.log('   - 100 seekers creados en barrios de Madrid')
    console.log('   - 20 alojamientos distribuidos por la ciudad')
    console.log('   - Todos con contraseña: Test123!')
    console.log('\n💡 Puedes usar cualquier email generado para hacer login')
}

main().catch(console.error)
