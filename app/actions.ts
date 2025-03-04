"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// Add Product (Creates Category if Not Exists)
export async function addProduct(productName: string, categoryName: string) {
  if (!productName.trim() || !categoryName.trim()) return;

  let category = await prisma.category.findUnique({
    where: { name: categoryName },
  });

  if (!category) {
    category = await prisma.category.create({ data: { name: categoryName } });
  }

  await prisma.product.create({
    data: { name: productName, categoryId: category.id },
  });

  revalidatePath("/products");
}

// Get Products with Pagination
export async function getProducts(page: number, pageSize: number = 10) {
  const products = await prisma.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: { category: true },
  });

  const totalProducts = await prisma.product.count();
  return { products, totalProducts };
}

// Update Product Name & Category
export async function updateProduct(id: number, name: string, categoryName: string) {
  let category = await prisma.category.findUnique({
    where: { name: categoryName },
  });

  if (!category) {
    category = await prisma.category.create({ data: { name: categoryName } });
  }

  await prisma.product.update({
    where: { id },
    data: { name, categoryId: category.id },
  });

  revalidatePath("/products");
}

// Delete Product
export async function deleteProduct(id: number) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/products");
}
