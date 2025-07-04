"use client";
import { useEffect, useState } from "react";
import { City, Region } from "@/types/location";
import GetCities, {
  CreateCity,
  UpdateCity,
  DeleteCity,
} from "@/services/cities";
import GetRegions from "@/services/regions";

export default function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [citiesData, regionsData] = await Promise.all([
        GetCities(),
        GetRegions(),
      ]);

      if (citiesData) {
        setCities(citiesData);
      }
      if (regionsData) {
        setRegions(regionsData);
      }
    } catch (err) {
      setError("Error fetching data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const createCity = async (cityData: { city: string; regionId: number }) => {
    setLoading(true);
    setError(null);
    try {
      const city: City = {
        id: 0,
        city: cityData.city,
        regionId: cityData.regionId,
      };

      const newCity = await CreateCity(city);
      if (newCity) {
        setCities((prev) => [...prev, newCity]);
        return newCity;
      }
    } catch (err) {
      setError("Error creating city");
      console.error("Error creating city:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateCity = async (id: number, cityData: Partial<City>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCity = await UpdateCity(id, cityData as City);
      if (updatedCity) {
        setCities((prev) =>
          prev.map((city) => (city.id === id ? updatedCity : city))
        );
        return updatedCity;
      }
    } catch (err) {
      setError("Error updating city");
      console.error("Error updating city:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCity = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const success = await DeleteCity(id);
      if (success) {
        setCities((prev) => prev.filter((city) => city.id !== id));
        return true;
      }
    } catch (err) {
      setError("Error deleting city");
      console.error("Error deleting city:", err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  return {
    cities,
    regions,
    loading,
    error,
    fetchData,
    createCity,
    updateCity,
    deleteCity,
  };
}
