"use client";
import { useEffect, useState } from "react";
import { Country } from "@/types/location";
import GetCountries, {
  CreateCountry,
  UpdateCountry,
  DeleteCountry,
} from "@/services/countries";

export default function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GetCountries();
      if (data) {
        setCountries(data);
      }
    } catch (err) {
      setError("Error fetching countries");
      console.error("Error fetching countries:", err);
    } finally {
      setLoading(false);
    }
  };

  const createCountry = async (countryData: { country: string }) => {
    setLoading(true);
    setError(null);
    try {
      const country: Country = {
        id: 0, // This will be set by the server
        country: countryData.country,
      };

      const newCountry = await CreateCountry(country);
      if (newCountry) {
        setCountries((prev) => [...prev, newCountry]);
        return newCountry;
      }
    } catch (err) {
      setError("Error creating country");
      console.error("Error creating country:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateCountry = async (id: number, countryData: Partial<Country>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCountry = await UpdateCountry(id, countryData as Country);
      if (updatedCountry) {
        setCountries((prev) =>
          prev.map((country) => (country.id === id ? updatedCountry : country))
        );
        return updatedCountry;
      }
    } catch (err) {
      setError("Error updating country");
      console.error("Error updating country:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCountry = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const success = await DeleteCountry(id);
      if (success) {
        setCountries((prev) => prev.filter((country) => country.id !== id));
        return true;
      }
    } catch (err) {
      setError("Error deleting country");
      console.error("Error deleting country:", err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  return {
    countries,
    loading,
    error,
    fetchCountries,
    createCountry,
    updateCountry,
    deleteCountry,
  };
}
