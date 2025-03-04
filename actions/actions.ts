"use server";
import prisma from "@/lib/prisma";


// 👉 Create Category
export async function createCategory(name: string) {
  return await prisma.category.create({ data: { name } });
}

// 👉 Get All Categories
export async function getCategories() {
  return await prisma.category.findMany();
}

// 👉 Delete Category
export async function deleteCategory(id: number) {
  return await prisma.category.delete({ where: { id } });
}

// 👉 Create Product
export async function createProduct(name: string, categoryName: string) {
  let category = await prisma.category.findUnique({ where: { name: categoryName } });

  if (!category) {
    category = await prisma.category.create({ data: { name: categoryName } });
  }

  return await prisma.product.create({ data: { name, categoryId: category.id } });
}

// 👉 Get Products with Pagination
export async function getProducts(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;
  const products = await prisma.product.findMany({
    skip,
    take: pageSize,
    include: { category: true }, // Fetch category details
  });

  const total = await prisma.product.count();
  return { products, total };
}

// 👉 Delete Product
export async function deleteProduct(id: number) {
  return await prisma.product.delete({ where: { id } });
}
