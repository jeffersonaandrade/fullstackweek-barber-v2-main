import { z } from 'zod'

export const ServiceSchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome muito longo'),
  description: z.string()
    .max(500, 'Descrição muito longa')
    .optional(),
  price: z.number()
    .positive('Preço deve ser positivo')
    .max(1000000, 'Preço muito alto'), // R$ 10.000,00
  category: z.enum(['cabelo', 'barba', 'sobrancelha', 'hidratacao', 'acabamento']),
  estimated_time: z.number()
    .positive('Tempo deve ser positivo')
    .max(480, 'Tempo máximo 8 horas'), // 480 minutos
  is_active: z.boolean(),
  image_url: z.string().url().optional()
})

export const BarbershopSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200, 'Nome muito longo'),
  address: z.string().min(1, 'Endereço é obrigatório').max(500, 'Endereço muito longo'),
  phones: z.array(z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Formato de telefone inválido')),
  description: z.string().max(1000, 'Descrição muito longa').optional(),
  is_active: z.boolean().default(true),
  commission_rate: z.number().min(0).max(100).default(30),
  timeout_minutes: z.number().min(1).max(480).default(10)
})

export const UserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200, 'Nome muito longo'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['client', 'barber', 'receptionist', 'admin']),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Formato de telefone inválido').optional(),
  barbershop_id: z.string().uuid().optional()
})

export const BookingSchema = z.object({
  service_id: z.string().uuid('ID do serviço inválido'),
  date: z.string().datetime('Data inválida'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).default('pending')
})

export const QueueEntrySchema = z.object({
  queue_id: z.string().uuid('ID da fila inválido'),
  customer_name: z.string().min(1, 'Nome do cliente é obrigatório'),
  customer_phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Telefone inválido'),
  is_guest: z.boolean().default(false),
  parent_phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Telefone do responsável inválido').optional()
}) 