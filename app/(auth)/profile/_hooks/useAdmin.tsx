import { Admin } from "@/types";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_ADMIN_PROFILE } from "../_graphql/mutation";
import {
  GET_COUNTRIES,
  GET_REGIONS_BY_COUNTRY,
  GET_CITIES_BY_REGION,
  GET_COUNTIES_BY_CITY,
} from "@/graphql/location/queries";
import useAdminType from "@/hooks/useAdminType";
import useSessionStore from "@/store/session";
import useAlert from "@/hooks/useAlert";

export default function useAdmin() {
  const { data, handleSession } = useSessionStore();
  const { isPlatformAdmin } = useAdminType();
  const { notify, notifyError } = useAlert();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Form state for editing
  const [formData, setFormData] = useState<Partial<Admin>>({});

  useEffect(() => {
    setFormData({
      name: data.name || "",
      lastName: data.lastName || "",
      email: data.email || "",
      role: data.role,
      adminType: data.adminType,
      permissions: data.permissions,
      isActive: data.isActive,
      isEmailVerified: data.isEmailVerified,
      country: data.country || null,
      region: data.region || null,
      city: data.city || null,
      county: data.county || null,
    });
  }, [data]);

  // Fetch location data
  const { data: countriesData } = useQuery(GET_COUNTRIES, {
    variables: { page: 1, pageSize: 300 },
  });

  const { data: regionsData } = useQuery(GET_REGIONS_BY_COUNTRY, {
    variables: { countryId: Number(formData.countryId), page: 1, pageSize: 300 },
    skip: !formData.countryId,
  });

  const { data: citiesData } = useQuery(GET_CITIES_BY_REGION, {
    variables: { regionId: Number(formData.regionId), page: 1, pageSize: 300 },
    skip: !formData.regionId,
  });

  const { data: countiesData } = useQuery(GET_COUNTIES_BY_CITY, {
    variables: { cityId: Number(formData.cityId), page: 1, pageSize: 300 },
    skip: !formData.cityId,
  });

  const [updateAdmin, { loading }] = useMutation(UPDATE_ADMIN_PROFILE, {
    onCompleted: (response) => {
      const updatedAdmin = response.updateAdmin;
      console.log("RESPONSE: ", response);

      // Update session store with new data
      handleSession(updatedAdmin);
      // Update local form data
      setFormData({
        name: updatedAdmin.name || "",
        lastName: updatedAdmin.lastName || "",
        email: updatedAdmin.email || "",
        role: updatedAdmin.role,
        adminType: updatedAdmin.adminType,
        permissions: updatedAdmin.permissions,
        isActive: updatedAdmin.isActive,
        isEmailVerified: updatedAdmin.isEmailVerified,
        countryId: updatedAdmin.countryId || null,
        regionId: updatedAdmin.regionId || null,
        cityId: updatedAdmin.cityId || null,
        countyId: updatedAdmin.countyId || null,
      });
      notify("Perfil actualizado correctamente");
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      notifyError(error.message || "Error al actualizar el perfil. Por favor, inténtelo de nuevo.");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value || null };

      // Reset dependent fields when parent changes
      if (name === "countryId") {
        updated.regionId = null;
        updated.cityId = null;
        updated.countyId = null;
      } else if (name === "regionId") {
        updated.cityId = null;
        updated.countyId = null;
      } else if (name === "cityId") {
        updated.countyId = null;
      }

      return updated;
    });
  };

  const handleSave = async () => {
    if (!data.id) {
      notifyError("No se encontró el ID del administrador.");
      return;
    }

    // Prepare input according to backend schema
    const input: {
      name?: string;
      lastName?: string;
      role?: string;
      permissions?: string[];
      isActive?: boolean;
      cityId?: number | null;
      countryId?: number | null;
      countyId?: number | null;
      regionId?: number | null;
    } = {};

    // Only include fields that have changed
    if (formData.name !== data.name && formData.name) {
      input.name = formData.name;
    }
    if (formData.lastName !== data.lastName && formData.lastName !== undefined) {
      input.lastName = formData.lastName || undefined;
    }
    if (formData.countryId !== data.countryId) {
      input.countryId = Number(formData.countryId);
    }
    if (formData.regionId !== data.regionId) {
      input.regionId = Number(formData.regionId);
    }
    if (formData.cityId !== data.cityId) {
      input.cityId = Number(formData.cityId);
    }
    if (formData.countyId !== data.countyId) {
      input.countyId = Number(formData.countyId);
    }

    // Only update if there are changes
    if (Object.keys(input).length === 0) {
      notify("No hay cambios para guardar");
      setIsEditing(false);
      return;
    }

    try {
      await updateAdmin({
        variables: {
          id: data.id,
          input,
        },
      });
    } catch (error) {
      console.error("Error in handleSave:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: data.name || "",
      lastName: data.lastName || "",
      email: data.email || "",
      role: data.role,
      adminType: data.adminType,
      permissions: data.permissions,
      isActive: data.isActive,
      isEmailVerified: data.isEmailVerified,
      countryId: data.countryId || null,
      regionId: data.regionId || null,
      cityId: data.cityId || null,
      countyId: data.countyId || null,
    });
    setIsEditing(false);
  };

  return {
    isEditing,
    setIsEditing,
    formData,
    handleInputChange,
    handleSelectChange,
    handleSave,
    handleCancel,
    data,
    isPlatformAdmin,
    loading,
    countries: countriesData?.getCountries?.nodes || [],
    regions: regionsData?.getRegionsByCountry?.nodes || [],
    cities: citiesData?.getCitiesByRegion?.nodes || [],
    counties: countiesData?.getCountiesByCity?.nodes || [],
  };
}
