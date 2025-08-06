require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!')
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas no arquivo .env')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

const SAMPLE_SERVICES = [
  {
    name: 'Corte Masculino',
    description: 'Corte tradicional masculino com tesoura e máquina, incluindo lavagem e finalização',
    category: 'cabelo',
    price: 3500, // R$ 35,00 em centavos
    estimated_time: 30,
    image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop',
    is_active: true
  },
  {
    name: 'Barba Tradicional',
    description: 'Acabamento de barba com navalha, incluindo hidratação e óleo para barba',
    category: 'barba',
    price: 2500, // R$ 25,00 em centavos
    estimated_time: 20,
    image_url: 'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400&h=300&fit=crop',
    is_active: true
  },
  {
    name: 'Corte + Barba',
    description: 'Combo completo: corte masculino + barba tradicional com desconto',
    category: 'cabelo',
    price: 5000, // R$ 50,00 em centavos
    estimated_time: 45,
    image_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop',
    is_active: true
  },
  {
    name: 'Sobrancelha',
    description: 'Design e modelagem de sobrancelhas masculinas',
    category: 'sobrancelha',
    price: 1500, // R$ 15,00 em centavos
    estimated_time: 15,
    image_url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=300&fit=crop',
    is_active: true
  },
  {
    name: 'Hidratação Capilar',
    description: 'Tratamento profundo de hidratação para cabelo masculino',
    category: 'hidratacao',
    price: 4000, // R$ 40,00 em centavos
    estimated_time: 25,
    image_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop',
    is_active: true
  },
  {
    name: 'Acabamento Premium',
    description: 'Acabamento detalhado com produtos premium e finalização profissional',
    category: 'acabamento',
    price: 2000, // R$ 20,00 em centavos
    estimated_time: 15,
    image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop',
    is_active: true
  }
]

async function createSampleServices() {
  try {
    console.log('🚀 Criando serviços de exemplo...')

    // Primeiro, vamos buscar uma barbearia existente
    const { data: barbershops, error: barbershopError } = await supabaseAdmin
      .from('barbershops')
      .select('id, name')
      .limit(1)

    if (barbershopError || !barbershops || barbershops.length === 0) {
      console.error('❌ Nenhuma barbearia encontrada. Crie uma barbearia primeiro!')
      return
    }

    const barbershop = barbershops[0]
    console.log(`📍 Usando barbearia: ${barbershop.name} (ID: ${barbershop.id})`)

    // Criar serviços
    for (const service of SAMPLE_SERVICES) {
      const { data, error } = await supabaseAdmin
        .from('barbershop_services')
        .insert({
          barbershop_id: barbershop.id,
          name: service.name,
          description: service.description,
          category: service.category,
          price: service.price,
          estimated_time: service.estimated_time,
          image_url: service.image_url,
          is_active: service.is_active
        })
        .select()

      if (error) {
        console.error(`❌ Erro ao criar serviço "${service.name}":`, error)
      } else {
        console.log(`✅ Serviço criado: ${service.name} - R$ ${service.price}`)
      }
    }

    console.log('🎉 Serviços de exemplo criados com sucesso!')
    console.log(`📊 Total de serviços criados: ${SAMPLE_SERVICES.length}`)
    console.log(`🏪 Barbearia: ${barbershop.name}`)
    console.log('🔗 Acesse: /admin/barbershops para ver os serviços')

  } catch (error) {
    console.error('❌ Erro durante criação dos serviços:', error)
  }
}

// Executar o script
createSampleServices()
  .then(() => {
    console.log('✅ Script concluído')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erro no script:', error)
    process.exit(1)
  }) 