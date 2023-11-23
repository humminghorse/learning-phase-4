import { NextResponse } from 'next/server'

import prisma from '../../../../../lib/prisma'

// GET /api/pets/:id
export async function GET(request: Request, { params }: { params: { id: string } }) {
  // get id from params
  const id = params.id
  // findUnique returns a single pet with owner data
  const pet = await prisma.pet.findUnique({
    // where id is equal to the id param
    where: { id: Number(id) },
    // include owner data
    include: { owner: true, weights: true },
  })
  // return Response with pets to json
  return NextResponse.json({ pet })
}

// PUT /api/pets/:id
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  // get id from params
  const id = params.id
  // get data from request body
  const data = await request.json()
  // update pet record
  const pet = await prisma.pet.update({
    // where id is equal to the id param
    where: { id: Number(id) },
    // data from request body
    data: data.pet,
  })
  return NextResponse.json({ id: id })
}

// DELETE /api/pets/:id
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  // get id from params
  const id = params.id
  // delete pet record
  const pet = await prisma.pet.delete({
    // where id is equal to the id param
    where: { id: Number(id) },
  })
  return NextResponse.json({ id: id })
}
