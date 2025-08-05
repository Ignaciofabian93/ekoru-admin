/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery } from "@apollo/client";
import {
  GET_DEPARTMENT_CATEGORIES,
  GET_DEPARTMENTS,
  GET_PRODUCT_CATEGORIES,
} from "@/graphql/categories/categories";
import { useEffect } from "react";
import useAlert from "./useAlert";
import {
  Department,
  DepartmentCategory,
  ProductCategory,
} from "@/types/product";

export default function useCategories() {
  const { notifyError } = useAlert();
  const [
    Departments,
    {
      data: departmentsData,
      error: departmentsError,
      loading: departmentsLoading,
    },
  ] = useLazyQuery(GET_DEPARTMENTS);
  const [
    DepartmentCategories,
    {
      data: departmentCategoriesData,
      error: departmentCategoriesError,
      loading: departmentCategoriesLoading,
    },
  ] = useLazyQuery(GET_DEPARTMENT_CATEGORIES);
  const [
    ProductCategories,
    {
      data: productCategoriesData,
      error: productCategoriesError,
      loading: productCategoriesLoading,
    },
  ] = useLazyQuery(GET_PRODUCT_CATEGORIES);

  useEffect(() => {
    if (departmentsError) {
      notifyError("Error al intentar obtener los departamentos");
    }
  }, [departmentsError]);

  useEffect(() => {
    if (departmentCategoriesError) {
      notifyError("Error al intentar obtener las categorías de departamento");
    }
  }, [departmentCategoriesError]);

  useEffect(() => {
    if (productCategoriesError) {
      notifyError("Error al intentar obtener las categorías de producto");
    }
  }, [productCategoriesError]);

  return {
    Departments,
    DepartmentCategories,
    ProductCategories,
    departments: (departmentsData?.departments as Department[]) || [],
    departmentCategories:
      (departmentCategoriesData?.departmentCategories as DepartmentCategory[]) ||
      [],
    productCategories:
      (productCategoriesData?.productCategories as ProductCategory[]) || [],
    departmentsLoading,
    departmentCategoriesLoading,
    productCategoriesLoading,
  };
}
