"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";





const serviceList = [
  "Residential Mowing",
  "Commercial Mowing",
  "Edging & Trimming",
  "Pine Straw Installation",
  "Mulch Bed Maintenance",
  "Leaf Removal & Cleanup",
  "Gutter Cleaning",
  "Bush & Hedge Trimming",
  "Overgrowth Recovery",
  "Pond Perimeter Mowing",
  "Acreage Mowing",
  "Subdivision Lot Mowing",
  "Debris Hauling",
  "Property Cleanout",
  "Custom Category..."
];

export default function DropPinPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  const [author, setAuthor] = useState("");
  const [quickReviewAuthor, setQuickReviewAuthor] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");
  const [customService, setCustomService] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [stateInput, setStateInput] = useState("MS");
  const [zipCode, setZipCode] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");
  const [images, setImages] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [transpondApiKey, setTranspondApiKey] = useState("");
  const [transpondGroupId, setTranspondGroupId] = useState("");
  const [transpondConfigured, setTranspondConfigured] = useState(false);
  const [socialConnected, setSocialConnected] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [transpondSaveStatus, setTranspondSaveStatus] = useState("idle"); // idle, saving, saved, error
  const [showSocialWarningModal, setShowSocialWarningModal] = useState(false);
  const [expandedTab, setExpandedTab] = useState<"google" | "crm" | "social" | "team" | "company" | null>(null);
  const [showAddTechInput, setShowAddTechInput] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [authorList, setAuthorList] = useState<string[]>([]);
  const [newTechName, setNewTechName] = useState("");
  const [newRooferPasscode, setNewRooferPasscode] = useState("");
  const [isUpdatingPasscode, setIsUpdatingPasscode] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [newReviewUrlInput, setNewReviewUrlInput] = useState("");
  const [locations, setLocations] = useState<{ name: string; lat: number; lng: number }[]>([]);
  const [newCityName, setNewCityName] = useState("");
  const [showAddCityInput, setShowAddCityInput] = useState(false);
  const [isGeocodingCity, setIsGeocodingCity] = useState(false);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const [dynamicServices, setDynamicServices] = useState<string[]>(serviceList);

  // States for Company Settings tab
  const [profileCompanyName, setProfileCompanyName] = useState("");
  const [profileClientId, setProfileClientId] = useState("");
  const [profilePasscode, setProfilePasscode] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileTagline, setProfileTagline] = useState("");

  const fetchCompanyConfig = async (cid: string) => {
    try {
      const res = await fetch(`/api/config?clientId=${cid}`);
      if (res.ok) {
        const data = await res.json();
        if (data.serviceList && Array.isArray(data.serviceList)) {
          setDynamicServices(data.serviceList);
        }
        if (data.companyName) {
          setCompanyName(data.companyName);
          setProfileCompanyName(data.companyName);
        }
        if (data.clientId) {
          setProfileClientId(data.clientId);
        }
        if (data.rooferPasscode) {
          setProfilePasscode(data.rooferPasscode);
        }
        if (data.brand) {
          setProfilePhone(data.brand.phone || "");
          setProfileEmail(data.brand.email || "");
          setProfileTagline(data.brand.tagline || "");
        }
      }
    } catch (err) {
      console.error("Failed to fetch company config:", err);
    }
  };

  const fetchTranspondSettings = async (cid?: string) => {
    try {
      const targetCid = cid || activeClientId || "";
      const res = await fetch(`/api/auth/transpond/settings?clientId=${targetCid}`);
      if (res.ok) {
        const data = await res.json();
        setTranspondConfigured(data.configured || false);
        setTranspondGroupId(data.transpondGroupId || "");
        if (data.configured) {
          setTranspondApiKey(data.transpondApiKey || "");
        }
        setSocialConnected(data.socialConnected || false);
        setGoogleConnected(data.googleConnected || false);
        setAuthorList(data.technicians || []);
        setCompanyName(data.companyName || "");
        setGoogleReviewUrl(data.googleReviewUrl || "");
        setNewReviewUrlInput(data.googleReviewUrl || "");
        setLocations(data.locations || []);
      }
    } catch (err) {
      console.error("Failed to load Transpond settings:", err);
    }
  };

  const handleSaveTranspondSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setTranspondSaveStatus("saving");
    try {
      const res = await fetch("/api/auth/transpond/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: transpondApiKey, groupId: transpondGroupId, clientId: activeClientId })
      });
      if (res.ok) {
        setTranspondSaveStatus("saved");
        setTranspondConfigured(true);
        setTimeout(() => setTranspondSaveStatus("idle"), 3000);
        fetchTranspondSettings();
      } else {
        setTranspondSaveStatus("error");
      }
    } catch (err) {
      setTranspondSaveStatus("error");
      console.error(err);
    }
  };

  const handleAddTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechName.trim()) return;
    const updatedTechs = [...authorList, newTechName.trim()];
    try {
      const res = await fetch("/api/auth/transpond/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technicians: updatedTechs, clientId: activeClientId })
      });
      if (res.ok) {
        setNewTechName("");
        fetchTranspondSettings();
      } else {
        alert("Failed to add technician name.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding technician.");
    }
  };

  const handleDeleteTechnician = async (techName: string) => {
    if (!confirm(`Are you sure you want to remove ${techName}?`)) return;
    const updatedTechs = authorList.filter((tech) => tech !== techName);
    try {
      const res = await fetch("/api/auth/transpond/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technicians: updatedTechs, clientId: activeClientId })
      });
      if (res.ok) {
        fetchTranspondSettings();
      } else {
        alert("Failed to delete technician name.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting technician.");
    }
  };

  const handleSavePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRooferPasscode.trim()) return;
    setIsUpdatingPasscode(true);
    try {
      const res = await fetch("/api/auth/transpond/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rooferPasscode: newRooferPasscode.trim(), clientId: activeClientId })
      });
      if (res.ok) {
        setNewRooferPasscode("");
        alert("Portal passcode updated successfully!");
        fetchTranspondSettings();
      } else {
        alert("Failed to update passcode.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving passcode.");
    } finally {
      setIsUpdatingPasscode(false);
    }
  };

  const handleSaveReviewUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/transpond/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleReviewUrl: newReviewUrlInput.trim(), clientId: activeClientId })
      });
      if (res.ok) {
        alert("Google Review Link updated successfully!");
        fetchTranspondSettings();
      } else {
        alert("Failed to update Google Review Link.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving review link.");
    }
  };
  const handleProfileNameChange = (val: string) => {
    setProfileCompanyName(val);
    if (activeClientId === "lungrins-lawncare") {
      const slug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/(^-|-$)/g, "");
      setProfileClientId(slug);
    }
  };
  const handleSaveCompanyProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileCompanyName.trim() || !profileClientId.trim() || !profilePasscode.trim()) {
      alert("Company Name, Client ID, and Passcode are required.");
      return;
    }

    // Standardize slug format for client ID
    const slug = profileClientId.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/(^-|-$)/g, "");

    try {
      const res = await fetch("/api/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: slug,
          companyName: profileCompanyName.trim(),
          rooferPasscode: profilePasscode.trim(),
          googleReviewUrl: googleReviewUrl,
          brand: {
            phone: profilePhone.trim(),
            email: profileEmail.trim(),
            tagline: profileTagline.trim(),
            logoText: profileCompanyName.trim(),
            logoSubtext: ""
          },
          technicians: authorList,
          serviceList: dynamicServices
        })
      });

      if (res.ok) {
        alert("Company Profile saved successfully! Redirecting to your updated portal...");
        window.location.href = `/admin/drop-pin?clientId=${slug}`;
      } else {
        const data = await res.json();
        alert(`Failed to save company settings: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error saving company profile: ${err.message}`);
    }
  };

  const handleAddCityInline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;
    setIsGeocodingCity(true);
    try {
      const resGeocode = await fetch(`/api/geocode?address=${encodeURIComponent(newCityName.trim())}`);
      if (!resGeocode.ok) {
        throw new Error("Geocoding failed");
      }
      const results = await resGeocode.json();
      if (!results || results.length === 0) {
        alert(`Could not find coordinates for "${newCityName}". Please make sure to check the spelling (e.g. Greenwood, MS).`);
        setIsGeocodingCity(false);
        return;
      }
      const lat = parseFloat(results[0].lat);
      const lng = parseFloat(results[0].lon);

      const newLocItem = { name: newCityName.trim(), lat, lng };
      const updatedLocations = [...locations, newLocItem];

      const resSave = await fetch("/api/auth/transpond/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locations: updatedLocations, clientId: activeClientId })
      });

      if (resSave.ok) {
        setNewCityName("");
        setShowAddCityInput(false);
        setLocations(updatedLocations);
        setLocation(newLocItem.name);
        setLatitude(lat);
        setLongitude(lng);
        alert("Location added successfully!");
      } else {
        alert("Failed to save new location to database settings.");
      }
    } catch (err) {
      console.error(err);
      alert("Error resolving city coordinates. Please try again.");
    } finally {
      setIsGeocodingCity(false);
    }
  };

  const handleDeleteCity = async (cityName: string) => {
    if (!confirm(`Are you sure you want to remove ${cityName} from your service areas list?`)) return;
    const updatedLocations = locations.filter((loc) => loc.name !== cityName);
    try {
      const res = await fetch("/api/auth/transpond/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locations: updatedLocations, clientId: activeClientId })
      });
      if (res.ok) {
        setLocation("");
        setLocations(updatedLocations);
        alert("Location deleted successfully!");
      } else {
        alert("Failed to delete location from database settings.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting location.");
    }
  };

  const geocodeAddress = async () => {
    if (!streetAddress.trim()) {
      alert("Please enter a street address.");
      return;
    }

    setIsGeocoding(true);
    try {
      const parts = [
        streetAddress.trim(),
        cityInput.trim(),
        stateInput.trim(),
        zipCode.trim()
      ].filter(Boolean);
      
      const searchString = parts.join(", ");

      const response = await fetch(
        `/api/geocode/?q=${encodeURIComponent(searchString)}`
      );
      if (response.ok) {
        const results = await response.json();
        if (results && results.length > 0) {
          const firstResult = results[0];
          const lat = parseFloat(firstResult.lat);
          const lon = parseFloat(firstResult.lon);
          setLatitude(lat);
          setLongitude(lon);

          // Extract city from result
          let matchedCity = "";
          const displayName = firstResult.display_name.toLowerCase();
          for (const loc of locations) {
            const city = loc.name;
            const cityNameOnly = city.split(",")[0].toLowerCase().trim();
            if (displayName.includes(cityNameOnly)) {
              matchedCity = city;
              break;
            }
          }
          if (matchedCity) {
            setLocation(matchedCity);
          } else {
            let closestCity = "";
            let minDistance = Infinity;
            for (const loc of locations) {
              const city = loc.name;
              const coords = [loc.lat, loc.lng];
              const dist = Math.pow(lat - coords[0], 2) + Math.pow(lon - coords[1], 2);
              if (dist < minDistance) {
                minDistance = dist;
                closestCity = city;
              }
            }
            if (closestCity) {
              setLocation(closestCity);
            }
          }
          alert(`Success! Found coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}. Location updated to: ${matchedCity || "nearest match"}.`);
        } else {
          alert("Could not find coordinates for that address. Please check the spelling or enter coordinates manually.");
        }
      } else {
        alert("Address lookup failed. Please enter coordinates manually.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      alert("Error contacting address lookup service. Please enter coordinates manually.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const [geoLoading, setGeoLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Set default date to today's date format (e.g. Jul 22, 2026)
  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
    setDate(today.toLocaleDateString("en-US", options));
  }, []);

  // Check authentication and URL params on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let cid = urlParams.get("clientId");
    
    // Remember client ID in session storage to preserve context across redirects/reloads
    if (cid) {
      sessionStorage.setItem("pindrop_client_id", cid);
    } else {
      cid = sessionStorage.getItem("pindrop_client_id");
    }

    const initConfig = async (resolvedCid: string) => {
      setActiveClientId(resolvedCid);
      await fetchCompanyConfig(resolvedCid);
      await fetchTranspondSettings(resolvedCid);

      const cachedAuth = sessionStorage.getItem("roofer_pin_auth");
      if (cachedAuth === "true" || resolvedCid === "lungrins-lawncare") {
        setIsAuthenticated(true);
        const tourSeen = localStorage.getItem("pindrop_tour_seen");
        if (!tourSeen && resolvedCid === "lungrins-lawncare") {
          setTimeout(() => {
            setTourStep(1);
            setExpandedTab("company");
          }, 800);
        }
      }
    };

    if (cid) {
      initConfig(cid);
    } else {
      // If no client ID in URL or session storage, fetch the default server config
      const loadDefaultConfig = async () => {
        try {
          const res = await fetch("/api/config");
          if (res.ok) {
            const data = await res.json();
            const resolvedCid = data.clientId || "lungrins-lawncare";
            sessionStorage.setItem("pindrop_client_id", resolvedCid);
            initConfig(resolvedCid);
          } else {
            initConfig("lungrins-lawncare");
          }
        } catch (err) {
          console.error("Failed to load default server config:", err);
          initConfig("lungrins-lawncare");
        }
      };
      loadDefaultConfig();
    }

    const googleSync = urlParams.get("google_sync");
    const errorMsg = urlParams.get("message");
    if (googleSync === "success") {
      alert("🎉 Success! Your Google Business Profile is now connected and synced with PinDrop!");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (googleSync === "error") {
      alert(`❌ Google Auth Failed: ${errorMsg || "Unknown Error"}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, clientId: activeClientId })
      });
      if (res.ok) {
        sessionStorage.setItem("roofer_pin_auth", "true");
        setIsAuthenticated(true);
        fetchTranspondSettings(activeClientId || undefined);
        const tourSeen = localStorage.getItem("pindrop_tour_seen");
        if (!tourSeen && activeClientId === "lungrins-lawncare") {
          setTimeout(() => setTourStep(1), 800);
        }
      } else {
        const data = await res.json();
        setPasscodeError(data.error || "Incorrect passcode. Please try again.");
      }
    } catch (err) {
      setPasscodeError("Connection error. Please try again.");
    }
  };

  const handleFinishTour = () => {
    localStorage.setItem("pindrop_tour_seen", "true");
    setTourStep(null);
    setExpandedTab(null);
  };

  const handleRestartTour = () => {
    setTourStep(1);
    setExpandedTab("company");
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 150);
  };

  // Scroll to active walkthrough elements smoothly when step changes
  useEffect(() => {
    if (tourStep === 1) {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }, 150);
    } else if (tourStep === 2) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tourStep && tourStep >= 3) {
      setTimeout(() => {
        // Scroll to integrations card
        const integrationsCard = document.querySelector(".double-bezel-wrapper[style*='margin: 2rem auto 0']");
        if (integrationsCard) {
          integrationsCard.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }
      }, 150); // Small timeout to allow tab state to expand
    }
  }, [tourStep]);

  const getGPSLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setGeoLoading(false);

        // Deterministically find the closest city to coordinates
        let closestCity = "";
        let minDistance = Infinity;

        for (const loc of locations) {
          const city = loc.name;
          const coords = [loc.lat, loc.lng];
          const dist = Math.pow(lat - coords[0], 2) + Math.pow(lng - coords[1], 2);
          if (dist < minDistance) {
            minDistance = dist;
            closestCity = city;
          }
        }

        if (closestCity) {
          setLocation(closestCity);
        }
      },
      (error) => {
        setGeoLoading(false);
        console.error("GPS position fetch error:", error);
        alert(`Failed to fetch location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Client-side image compression and Firebase Storage upload helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    setUploadStatus("Processing images...");

    try {
      const fileList = Array.from(files);
      const newUrls: string[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        setUploadStatus(`Compressing photo ${i + 1} of ${fileList.length}...`);

        // Get base64 data URL from file
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

        // Compress image via Canvas
        const compressedBase64 = await new Promise<string>((resolve) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 700;
            const MAX_HEIGHT = 700;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL("image/jpeg", 0.5));
            } else {
              resolve(dataUrl);
            }
          };
          img.src = dataUrl;
        });

        // Upload to API
        setUploadStatus(`Uploading photo ${i + 1} of ${fileList.length} to Cloud...`);
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ base64Data: compressedBase64 }),
        });

        if (!response.ok) {
          throw new Error(`Upload failed for photo ${i + 1}`);
        }

        const data = await response.json();
        if (data.url) {
          newUrls.push(data.url);
        }
      }

      setImages((prev) => [...prev, ...newUrls]);
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err.message || "Failed to upload one or more photos. Please try again.");
    } finally {
      setIsCompressing(false);
      setUploadStatus("");
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalService = service === "Custom Category..." ? customService : service;

    if (!author || !location || !finalService || !description || images.length === 0) {
      setSubmitError("Please fill in all fields and upload at least one image.");
      return;
    }

    setSubmitLoading(true);
    setSubmitError("");

    const payload = {
      author,
      date,
      location,
      service: finalService,
      description,
      images,
      latitude: latitude !== "" ? latitude : undefined,
      longitude: longitude !== "" ? longitude : undefined,
      clientId: activeClientId || undefined
    };

    try {
      const response = await fetch("/api/pins/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubmitSuccess(true);
        // Reset form values
        setAuthor("");
        setDescription("");
        setImages([]);
        setLatitude("");
        setLongitude("");
        setService("");
        setCustomService("");
        setStreetAddress("");
        setCityInput("");
        setStateInput("MS");
        setZipCode("");
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.error || "Failed to drop pin. Try again.");
      }
    } catch (err) {
      console.error("Failed to post pin:", err);
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-backdrop">
        <div className="double-bezel-wrapper login-card">
          <div className="double-bezel-inner login-inner">
            <h2 className="title">Lungrin&apos;s Lawncare</h2>
            <p className="subtitle">Enter passcode to drop job pins</p>
            <form onSubmit={handleLogin} className="form">
              <input
                type="password"
                placeholder="Passcode"
                className="input"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
              />
              {passcodeError && <p className="error">{passcodeError}</p>}
              <button type="submit" className="btn btn-outline submit-btn">
                Unlock Portal
              </button>
            </form>
          </div>
        </div>

        <style jsx>{`
          .login-backdrop {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
            background: var(--bg);
          }
          .login-card {
            width: 100%;
            max-width: 400px;
          }
          .login-inner {
            padding: 2.5rem !important;
            text-align: center;
          }
          .title {
            color: var(--primary);
            font-size: 1.8rem;
            font-weight: 800;
            margin-bottom: 0.25rem;
          }
          .subtitle {
            color: var(--text-muted);
            font-size: 0.9rem;
            margin-bottom: 2rem;
          }
          .form {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
          }
          .input {
            width: 100%;
            padding: 0.8rem 1rem;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border);
            border-radius: 8px;
            color: #ffffff;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.2s;
            text-align: center;
          }
          .input:focus {
            border-color: var(--secondary);
          }
          .error {
            color: #ef4444;
            font-size: 0.82rem;
            margin: 0;
          }
          .submit-btn {
            padding: 0.85rem !important;
            font-size: 0.95rem;
            font-weight: 700;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="portal-container">
      <div className="container">
        
        <div className="portal-header" style={{ position: "relative" }}>
          <span className="eyebrow" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{companyName || "Power Digital Media"}</span>
            <button 
              type="button"
              onClick={handleRestartTour}
              style={{ background: "rgba(226, 176, 71, 0.15)", border: "1px solid #e2b047", color: "#e2b047", padding: "4px 12px", borderRadius: "20px", fontSize: "0.72rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: "bold" }}
            >
              🎓 Take Tour
            </button>
          </span>
          <h1>{companyName ? `${companyName}` : "Lungrin\u0027s Lawncare"}</h1>
          <p className="subtitle">{profileTagline || "Submit recent project photographs and details from the field"}</p>
        </div>

        {activeClientId === "lungrins-lawncare" && (
          <div style={{
            background: "rgba(226, 176, 71, 0.08)",
            border: "1px solid #e2b047",
            borderRadius: "12px",
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            color: "#ffffff",
            fontSize: "0.85rem",
            lineHeight: "1.5",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            textAlign: "left"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.4rem" }}>⚙️</span>
              <div>
                <strong>You are viewing the Generic Portal Template.</strong> Try typing crew names, dropping pins, and adding service cities to see how it works!
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", paddingTop: "10px", borderTop: "1px dashed rgba(226, 176, 71, 0.2)" }}>
              <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>
                Want to launch a private map and embed widgets on your own website?
              </span>
              <a
                href="/register"
                style={{
                  background: "#e2b047",
                  color: "#0b0c10",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  fontSize: "0.78rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  boxShadow: "0 4px 15px rgba(226, 176, 71, 0.25)"
                }}
              >
                🚀 Register Your Business
              </a>
            </div>
          </div>
        )}

        {submitSuccess ? (
          <div className="double-bezel-wrapper success-card">
            <div className="double-bezel-inner success-inner">
              <span className="success-icon">🎉</span>
              <h3>Pin Dropped Successfully!</h3>
              <p style={{ marginBottom: "1.5rem" }}>The job has been recorded and will show on the map and feed in real-time.</p>
              
              {/* Review request integration */}
              <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem", textAlign: "left" }}>
                <h4 style={{ color: "#ffffff", fontSize: "0.95rem", fontWeight: "800", marginBottom: "0.5rem" }}>👉 Send Google Review Request</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 1rem 0", lineHeight: "1.5" }}>
                  Send a pre-filled review request to the customer&apos;s phone or email right now:
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <a
                    href={`sms:?body=Hi! This is ${author ? author.split(" ")[0] : (companyName || "our representative")} from ${companyName || "our company"}. It was a pleasure working on your home. Would you mind leaving us a quick Google review? You can leave it here: ${googleReviewUrl}`}
                    className="btn btn-outline"
                    style={{ flex: "1 1 120px", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.8rem", padding: "8px 12px", background: "rgba(226, 176, 71, 0.05)" }}
                  >
                    💬 Send SMS
                  </a>
                  <a
                    href={`mailto:?subject=Review for ${companyName || "our company"}&body=Hi there,%0D%0A%0D%0AThis is ${author ? author.split(" ")[0] : (companyName || "our representative")} from ${companyName || "our company"}. It was a pleasure working on your home. Would you mind leaving us a quick Google review?%0D%0A%0D%0AYou can leave it here:%0D%0A${googleReviewUrl}%0D%0A%0D%0AThank you!`}
                    className="btn btn-outline"
                    style={{ flex: "1 1 120px", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.8rem", padding: "8px 12px", background: "rgba(226, 176, 71, 0.05)" }}
                  >
                    ✉️ Send Email
                  </a>
                </div>
              </div>

              <div className="success-buttons">
                <button onClick={() => setSubmitSuccess(false)} className="btn btn-outline" style={{ width: "100%" }}>
                  Drop Another Pin
                </button>
                <Link href="/pins/" className="btn btn-outline" style={{ background: "transparent", width: "100%" }}>
                  View Project Map
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="double-bezel-wrapper form-card">
            <div className="double-bezel-inner form-inner">
              <form onSubmit={handleSubmit} className="portal-form">
                
                {/* Team Member Name */}
                <div className="form-group" style={{ border: tourStep === 1 ? "2px solid #e2b047" : "1px solid transparent", borderRadius: "8px", padding: tourStep === 1 ? "8px" : "0", boxShadow: tourStep === 1 ? "0 0 12px rgba(226, 176, 71, 0.4)" : "none", transition: "all 0.3s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="form-label">Team Member Name</label>
                    {author && (
                      <button
                        type="button"
                        onClick={() => handleDeleteTechnician(author)}
                        style={{ background: "none", border: "none", color: "#ef4444", fontSize: "0.72rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px", padding: "0 0 4px 0" }}
                      >
                        🗑️ Delete {author}
                      </button>
                    )}
                  </div>
                  <select
                    className="form-input"
                    value={author}
                    onChange={(e) => {
                      if (e.target.value === "ADD_NEW_TECH") {
                        setShowAddTechInput(true);
                        setAuthor("");
                      } else {
                        setAuthor(e.target.value);
                      }
                    }}
                    required={!showAddTechInput}
                  >
                    <option value="">Select Team Member</option>
                    {authorList.map((auth) => (
                      <option key={auth} value={auth}>{auth}</option>
                    ))}
                    <option value="ADD_NEW_TECH" style={{ color: "#e2b047", fontWeight: "bold" }}>+ Add New Team Member...</option>
                  </select>

                  {showAddTechInput && (
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                      <input
                        type="text"
                        placeholder="Team member full name"
                        value={newTechName}
                        onChange={(e) => setNewTechName(e.target.value)}
                        style={{ flex: 1, padding: "6px 10px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#fff" }}
                      />
                      <button
                        type="button"
                        onClick={async (e) => {
                          await handleAddTechnician(e);
                          setShowAddTechInput(false);
                        }}
                        className="btn btn-outline"
                        style={{ fontSize: "0.72rem", height: "30px", background: "rgba(226, 176, 71, 0.15)", color: "#e2b047", border: "1px solid #e2b047", cursor: "pointer", borderRadius: "4px" }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddTechInput(false);
                          setNewTechName("");
                        }}
                        style={{ fontSize: "0.72rem", height: "30px", background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Job Location */}
                <div className="form-group animate-fade-in">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="form-label">Location (City)</label>
                    {location && location !== "ADD_NEW_CITY" && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCity(location)}
                        style={{ fontSize: "0.68rem", color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "0 0 4px 0" }}
                      >
                        🗑️ Delete {location.split(",")[0]}
                      </button>
                    )}
                  </div>
                  <select
                    className="form-input"
                    value={location}
                    onChange={(e) => {
                      if (e.target.value === "ADD_NEW_CITY") {
                        setShowAddCityInput(true);
                        setLocation("");
                      } else {
                        setLocation(e.target.value);
                        const matchedLoc = locations.find((l) => l.name === e.target.value);
                        if (matchedLoc) {
                          setLatitude(matchedLoc.lat);
                          setLongitude(matchedLoc.lng);
                        }
                      }
                    }}
                    required
                  >
                    <option value="">Select City</option>
                    {locations.map((loc) => (
                      <option key={loc.name} value={loc.name}>{loc.name}</option>
                    ))}
                    <option value="ADD_NEW_CITY" style={{ color: "#e2b047", fontWeight: "bold" }}>+ Add New City...</option>
                  </select>

                  {showAddCityInput && (
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }} className="animate-fade-in">
                      <input
                        type="text"
                        placeholder="City name, State (e.g. Greenwood, MS)"
                        value={newCityName}
                        onChange={(e) => setNewCityName(e.target.value)}
                        style={{ flex: 1, padding: "6px 10px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#fff" }}
                      />
                      <button
                        type="button"
                        disabled={isGeocodingCity}
                        onClick={handleAddCityInline}
                        className="btn btn-outline"
                        style={{ fontSize: "0.72rem", height: "30px", background: "rgba(226, 176, 71, 0.15)", color: "#e2b047", border: "1px solid #e2b047", cursor: "pointer", borderRadius: "4px", opacity: isGeocodingCity ? 0.5 : 1 }}
                      >
                        {isGeocodingCity ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddCityInput(false);
                          setNewCityName("");
                        }}
                        style={{ fontSize: "0.72rem", height: "30px", background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Service Category */}
                <div className="form-group">
                  <label className="form-label">Service Type</label>
                  <select
                    className="form-input"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    required
                  >
                    <option value="">Select Service Type</option>
                    {dynamicServices.map((svc) => (
                      <option key={svc} value={svc}>{svc}</option>
                    ))}
                  </select>
                </div>

                {service === "Custom Category..." && (
                  <div className="form-group animate-fade-in">
                    <label className="form-label">Specify Custom Service Type</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Sheetrock & Drywall, Plumbing, Siding"
                      value={customService}
                      onChange={(e) => setCustomService(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* GPS Coordinates Wrapper */}
                <div className="form-group">
                  <label className="form-label">GPS / Location Coordinates</label>
                  <div className="gps-row">
                    <button
                      type="button"
                      className="btn btn-outline gps-btn"
                      onClick={getGPSLocation}
                      disabled={geoLoading}
                    >
                      {geoLoading ? "Locating..." : "📍 Get Current Coords"}
                    </button>
                    <div className="coords-display">
                      <div className="coord-field">
                        <span>Lat:</span>
                        <input
                          type="number"
                          step="any"
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value === "" ? "" : parseFloat(e.target.value))}
                          placeholder="e.g. 32.27"
                          className="coord-input"
                          style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", borderRadius: "4px", padding: "4px 8px", color: "#ffffff" }}
                        />
                      </div>
                      <div className="coord-field">
                        <span>Lng:</span>
                        <input
                          type="number"
                          step="any"
                          value={longitude}
                          onChange={(e) => setLongitude(e.target.value === "" ? "" : parseFloat(e.target.value))}
                          placeholder="e.g. -90.13"
                          className="coord-input"
                          style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", borderRadius: "4px", padding: "4px 8px", color: "#ffffff" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Lookup Helper */}
                <div className="form-group" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", borderRadius: "8px", padding: "1.25rem" }}>
                  <label className="form-label" style={{ fontSize: "0.75rem", color: "var(--secondary)", marginBottom: "0.5rem" }}>Convert Address to Coords (Optional)</label>
                  
                  {/* Street Address */}
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>Street Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 150 Highland Dr"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  {/* City, State, Zip Row */}
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <div style={{ flex: "2 1 120px" }}>
                      <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>City</label>
                      <input
                        type="text"
                        placeholder="e.g. Brandon"
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div style={{ flex: "1 1 60px" }}>
                      <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>State</label>
                      <input
                        type="text"
                        placeholder="MS"
                        value={stateInput}
                        onChange={(e) => setStateInput(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div style={{ flex: "1.5 1 80px" }}>
                      <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>Zip Code</label>
                      <input
                        type="text"
                        placeholder="e.g. 39042"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Convert Button */}
                  <button
                    type="button"
                    onClick={geocodeAddress}
                    className="convert-btn"
                    disabled={isGeocoding}
                    style={{ width: "100%", justifyContent: "center", height: "42px" }}
                  >
                    {isGeocoding ? "Searching Coordinates..." : "🔍 Convert to Coordinates"}
                  </button>

                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: "8px 0 0 0", lineHeight: "1.4" }}>
                    If you are in the office, enter the job address and click Convert to automatically update coordinates and matching city.
                  </p>
                </div>

                {/* Date (Read-Only/Autocompleted) */}
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="text" className="form-input" value={date} disabled />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Project Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe the job. E.g., Installed a GAF Timberline HDZ architectural roof system in Byram, MS. Completed leak diagnostics near the chimney."
                    className="form-input textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Photo Upload and Capture */}
                <div className="form-group">
                  <label className="form-label">Project Photographs (1-4 images)</label>
                  {isCompressing ? (
                    <div className="upload-btn disabled">
                      {uploadStatus || "Processing Images..."}
                    </div>
                  ) : (
                    <div className="upload-buttons-container">
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="upload-hidden-input"
                        id="photo-capture"
                        onChange={handleImageUpload}
                        disabled={isCompressing}
                      />
                      <label htmlFor="photo-capture" className="upload-btn primary-upload-btn">
                        📸 Take Live Photo
                      </label>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="upload-hidden-input"
                        id="photo-gallery"
                        onChange={handleImageUpload}
                        disabled={isCompressing}
                      />
                      <label htmlFor="photo-gallery" className="upload-btn outline-upload-btn">
                        📁 Select from Gallery
                      </label>
                    </div>
                  )}

                  {images.length > 0 && (
                    <div className="preview-grid">
                      {images.map((img, idx) => (
                        <div key={idx} className="preview-item">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt={`Preview ${idx}`} className="preview-img" />
                          <button
                            type="button"
                            className="preview-remove"
                            onClick={() => handleRemoveImage(idx)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {submitError && <p className="submit-error">{submitError}</p>}

                {/* Form Buttons */}
                <button
                  type="submit"
                  className="btn btn-outline submit-form-btn"
                  disabled={submitLoading || isCompressing}
                >
                  {submitLoading ? "Submitting..." : "Submit Project Pin"}
                </button>

              </form>
            </div>
          </div>

          {/* Quick Review Requester */}
          <div className="double-bezel-wrapper" style={{ maxWidth: "580px", margin: "2rem auto 0", height: "auto" }}>
            <div className="double-bezel-inner" style={{ padding: "1.5rem", textAlign: "left", height: "auto" }}>
              <h3 style={{ color: "#ffffff", fontSize: "1.05rem", fontWeight: "800", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>⚡</span> Direct Review Requester
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 1.25rem 0", lineHeight: "1.5" }}>
                Send a review request immediately to your customer (no pin drop required):
              </p>
              
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <select
                    className="form-input"
                    value={quickReviewAuthor}
                    onChange={(e) => setQuickReviewAuthor(e.target.value)}
                    style={{ margin: 0, width: "100%", height: "42px", background: "rgba(255, 255, 255, 0.02)" }}
                  >
                    <option value="">Select Your Name...</option>
                    {authorList.map((auth) => (
                      <option key={auth} value={auth}>{auth}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", gap: "10px", flex: "1 1 250px" }}>
                  <a
                    href={quickReviewAuthor ? `sms:?body=Hi! This is ${quickReviewAuthor.split(" ")[0]} from ${companyName || "our company"}. It was a pleasure working on your home. Would you mind leaving us a quick Google review? You can leave it here: ${googleReviewUrl}` : "#"}
                    onClick={(e) => { 
                      if (!quickReviewAuthor) { e.preventDefault(); alert("Please select a team member name first!"); }
                      else if (!googleReviewUrl) { e.preventDefault(); alert("Please configure your Google Review Link in the settings accordion below first!"); }
                    }}
                    className="btn btn-outline"
                    style={{ flex: "1", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.8rem", height: "42px", background: (quickReviewAuthor && googleReviewUrl) ? "rgba(226, 176, 71, 0.08)" : "rgba(255, 255, 255, 0.02)", opacity: (quickReviewAuthor && googleReviewUrl) ? 1 : 0.5 }}
                  >
                    💬 Text Customer
                  </a>
                  <a
                    href={quickReviewAuthor ? `mailto:?subject=Review for ${companyName || "our company"}&body=Hi there,%0D%0A%0D%0AThis is ${quickReviewAuthor.split(" ")[0]} from ${companyName || "our company"}. It was a pleasure working on your home. Would you mind leaving us a quick Google review?%0D%0A%0D%0AYou can leave it here:%0D%0A${googleReviewUrl}%0D%0A%0D%0AThank you!` : "#"}
                    onClick={(e) => { 
                      if (!quickReviewAuthor) { e.preventDefault(); alert("Please select a team member name first!"); }
                      else if (!googleReviewUrl) { e.preventDefault(); alert("Please configure your Google Review Link in the settings accordion below first!"); }
                    }}
                    className="btn btn-outline"
                    style={{ flex: "1", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.8rem", height: "42px", background: (quickReviewAuthor && googleReviewUrl) ? "rgba(226, 176, 71, 0.08)" : "rgba(255, 255, 255, 0.02)", opacity: (quickReviewAuthor && googleReviewUrl) ? 1 : 0.5 }}
                  >
                    ✉️ Email Customer
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Unified Integrations Accordion Card */}
          <div className="double-bezel-wrapper" style={{ maxWidth: "580px", margin: "2rem auto 0", height: "auto" }}>
            <div className="double-bezel-inner" style={{ padding: "1.5rem", textAlign: "left", height: "auto" }}>
              <h3 style={{ color: "#ffffff", fontSize: "1.1rem", fontWeight: "800", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🔌</span> Unified Integrations
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  
                  {/* Company Profile Settings Tab */}
                  <div style={{ border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "8px", overflow: "hidden", background: "rgba(255,255,255,0.01)" }}>
                    <div 
                      onClick={() => setExpandedTab(expandedTab === "company" ? null : "company")}
                      style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: "rgba(255, 255, 255, 0.02)", userSelect: "none" }}
                    >
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>🏢</span> Company Profile Settings
                      </span>
                      <span style={{ color: "#e2b047", fontSize: "0.7rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                        {activeClientId === "lungrins-lawncare" ? "⚠️ Configure" : "✓ Active"} {expandedTab === "company" ? "▲" : "▼"}
                      </span>
                    </div>

                    {expandedTab === "company" && (
                      <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.15)" }}>
                        <form onSubmit={handleSaveCompanyProfile} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          
                          <div>
                            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", marginBottom: "4px" }}>Company Name</label>
                            <input
                              type="text"
                              value={profileCompanyName}
                              onChange={(e) => handleProfileNameChange(e.target.value)}
                              placeholder="e.g. Acme Services"
                              style={{ width: "100%", padding: "8px 12px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff" }}
                              required
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", marginBottom: "4px" }}>Portal Slug (Client ID)</label>
                            <input
                              type="text"
                              value={profileClientId}
                              placeholder="e.g. acme-services"
                              style={{ width: "100%", padding: "8px 12px", fontSize: "0.75rem", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px", color: "#888", cursor: "not-allowed" }}
                              readOnly
                              required
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", marginBottom: "4px" }}>Crew Passcode</label>
                            <input
                              type="text"
                              value={profilePasscode}
                              onChange={(e) => setProfilePasscode(e.target.value)}
                              placeholder="e.g. passcode123"
                              style={{ width: "100%", padding: "8px 12px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff" }}
                              required
                            />
                          </div>

                          <div style={{ display: "flex", gap: "10px" }}>
                            <div style={{ flex: 1 }}>
                              <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", marginBottom: "4px" }}>Company Phone</label>
                              <input
                                type="text"
                                value={profilePhone}
                                onChange={(e) => setProfilePhone(e.target.value)}
                                placeholder="e.g. 800-555-0100"
                                style={{ width: "100%", padding: "8px 12px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff" }}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", marginBottom: "4px" }}>Company Email</label>
                              <input
                                type="email"
                                value={profileEmail}
                                onChange={(e) => setProfileEmail(e.target.value)}
                                placeholder="e.g. contact@acmeservices.com"
                                style={{ width: "100%", padding: "8px 12px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff" }}
                              />
                            </div>
                          </div>

                          <div>
                            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", marginBottom: "4px" }}>Company Slogan / Tagline</label>
                            <input
                              type="text"
                              value={profileTagline}
                              onChange={(e) => setProfileTagline(e.target.value)}
                              placeholder="e.g. We get the job done right"
                              style={{ width: "100%", padding: "8px 12px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff" }}
                            />
                          </div>

                          <button
                            type="submit"
                            className="btn btn-outline"
                            style={{ marginTop: "8px", width: "100%", fontSize: "0.75rem", height: "36px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(226, 176, 71, 0.15)", color: "#ffffff", border: "1px solid #e2b047", cursor: "pointer", borderRadius: "6px" }}
                          >
                            💾 Save Company Profile
                          </button>
                        </form>
                      </div>
                    )}
                  </div>

                  <div style={{ border: tourStep === 2 ? "2px solid #e2b047" : "1px solid rgba(255, 255, 255, 0.05)", boxShadow: tourStep === 2 ? "0 0 10px rgba(226, 176, 71, 0.3)" : "none", transition: "all 0.3s", borderRadius: "8px", overflow: "hidden", background: "rgba(255,255,255,0.01)" }}>
                    <div 
                      onClick={() => setExpandedTab(expandedTab === "google" ? null : "google")}
                      style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: "rgba(255, 255, 255, 0.02)", userSelect: "none" }}
                    >
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>🌐</span> Google Maps Sync
                      </span>
                      <span style={{ color: googleConnected ? "#10b981" : "#e1b047", fontSize: "0.7rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                        {googleConnected ? "✓ Connected" : "⚠️ Pending"} {expandedTab === "google" ? "▲" : "▼"}
                      </span>
                    </div>
                    
                    {expandedTab === "google" && (
                      <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.15)" }}>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 1rem 0", lineHeight: "1.4" }}>
                          Push check-ins and project photos straight to Google Maps. (<span style={{ color: "#e2b047", cursor: "pointer", textDecoration: "underline" }} onClick={() => setShowGoogleModal(true)}>Guide</span>)
                        </p>
                        <button
                          type="button"
                          onClick={() => window.location.href = `/api/auth/google/login?clientId=${activeClientId}`}
                          className="btn btn-outline"
                          style={{ width: "100%", fontSize: "0.75rem", height: "36px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(226, 176, 71, 0.08)", color: "#ffffff", border: "1px solid #e2b047", cursor: "pointer" }}
                        >
                          {googleConnected ? "🔄 Re-connect Maps Profile" : "Connect Maps Profile"}
                        </button>

                        <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
                          <h5 style={{ color: "#ffffff", fontSize: "0.78rem", fontWeight: "700", marginBottom: "8px" }}>⭐ Google Review Link</h5>
                          <form onSubmit={handleSaveReviewUrl} style={{ display: "flex", gap: "8px" }}>
                            <input
                              type="text"
                              placeholder="Paste Google Review Link"
                              value={newReviewUrlInput}
                              onChange={(e) => setNewReviewUrlInput(e.target.value)}
                              style={{ flex: 1, padding: "6px 10px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#fff" }}
                            />
                            <button
                              type="submit"
                              className="btn btn-outline"
                              style={{ fontSize: "0.72rem", height: "30px", background: "rgba(226, 176, 71, 0.15)", color: "#e2b047", border: "1px solid #e2b047", cursor: "pointer", borderRadius: "4px", padding: "0 12px" }}
                            >
                              Save Link
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ border: tourStep === 3 ? "2px solid #e2b047" : "1px solid rgba(255, 255, 255, 0.05)", boxShadow: tourStep === 3 ? "0 0 10px rgba(226, 176, 71, 0.3)" : "none", transition: "all 0.3s", borderRadius: "8px", overflow: "hidden", background: "rgba(255,255,255,0.01)" }}>
                    <div 
                      onClick={() => setExpandedTab(expandedTab === "crm" ? null : "crm")}
                      style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: "rgba(255, 255, 255, 0.02)", userSelect: "none" }}
                    >
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>📋</span> Transpond CRM
                      </span>
                      {transpondConfigured ? (
                        <span style={{ color: "#4caf50", fontSize: "0.7rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                          ✓ Connected {expandedTab === "crm" ? "▲" : "▼"}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                          Not Configured {expandedTab === "crm" ? "▲" : "▼"}
                        </span>
                      )}
                    </div>
                    
                    {expandedTab === "crm" && (
                      <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.15)" }}>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 1rem 0", lineHeight: "1.4" }}>
                          Sync reviews and customer leads into your CRM account.
                        </p>
                        
                        <form onSubmit={handleSaveTranspondSettings} style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                          <input
                            type="password"
                            placeholder="Transpond API Key"
                            value={transpondApiKey === "env_configured" ? "" : transpondApiKey}
                            disabled={transpondApiKey === "env_configured"}
                            onChange={(e) => setTranspondApiKey(e.target.value)}
                            style={{ width: "100%", padding: "6px 10px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#fff" }}
                          />
                          {transpondApiKey === "env_configured" && (
                            <div style={{ fontSize: "0.65rem", color: "#4caf50", marginTop: "-4px" }}>Configured in environment file</div>
                          )}
                          <input
                            type="text"
                            placeholder="Transpond Group ID"
                            value={transpondGroupId}
                            onChange={(e) => setTranspondGroupId(e.target.value)}
                            style={{ width: "100%", padding: "6px 10px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#fff" }}
                          />
                          <button
                            type="submit"
                            className="btn btn-outline"
                            disabled={transpondSaveStatus === "saving" || transpondApiKey === "env_configured"}
                            style={{ width: "100%", fontSize: "0.72rem", height: "30px", background: "rgba(255, 255, 255, 0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", borderRadius: "4px" }}
                          >
                            {transpondSaveStatus === "saving" ? "Saving..." : transpondSaveStatus === "saved" ? "Saved! ✓" : "Save CRM Keys"}
                          </button>
                        </form>

                        <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
                          <h5 style={{ color: "#ffffff", fontSize: "0.78rem", fontWeight: "700", marginBottom: "8px" }}>🔒 Update Field Passcode</h5>
                          <form onSubmit={handleSavePasscode} style={{ display: "flex", gap: "8px" }}>
                            <input
                              type="password"
                              placeholder="New Field Passcode"
                              value={newRooferPasscode}
                              onChange={(e) => setNewRooferPasscode(e.target.value)}
                              style={{ flex: 1, padding: "6px 10px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#fff" }}
                            />
                            <button
                              type="submit"
                              className="btn btn-outline"
                              disabled={isUpdatingPasscode}
                              style={{ fontSize: "0.72rem", height: "30px", background: "rgba(226, 176, 71, 0.15)", color: "#e2b047", border: "1px solid #e2b047", cursor: "pointer", borderRadius: "4px", padding: "0 12px" }}
                            >
                              {isUpdatingPasscode ? "Saving..." : "Save"}
                            </button>
                          </form>
                        </div>

                        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px", marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          <span>Don't have accounts?</span>
                          <a href="https://get.capsulenow.io/w87ng8tquqti" target="_blank" rel="noopener noreferrer" style={{ color: "#e2b047", textDecoration: "underline" }}>Capsule</a>
                          <span>•</span>
                          <a href="https://get.capsulenow.io/h70zife95sd6-no30m" target="_blank" rel="noopener noreferrer" style={{ color: "#e2b047", textDecoration: "underline" }}>Transpond</a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ border: tourStep === 4 ? "2px solid #e2b047" : "1px solid rgba(255, 255, 255, 0.05)", boxShadow: tourStep === 4 ? "0 0 10px rgba(226, 176, 71, 0.3)" : "none", transition: "all 0.3s", borderRadius: "8px", overflow: "hidden", background: "rgba(255,255,255,0.01)" }}>
                    <div 
                      onClick={() => setExpandedTab(expandedTab === "social" ? null : "social")}
                      style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: "rgba(255, 255, 255, 0.02)", userSelect: "none" }}
                    >
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>📱</span> Social Media Auto-Post
                      </span>
                      {socialConnected ? (
                        <span style={{ color: "#4caf50", fontSize: "0.7rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                          ✓ Active {expandedTab === "social" ? "▲" : "▼"}
                        </span>
                      ) : (
                        <span style={{ color: transpondConfigured ? "#e1b047" : "#f44336", fontSize: "0.7rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                          {transpondConfigured ? "Not Connected" : "🔒 Locked"} {expandedTab === "social" ? "▲" : "▼"}
                        </span>
                      )}
                    </div>
                    
                    {expandedTab === "social" && (
                      <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.15)" }}>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 1rem 0", lineHeight: "1.4" }}>
                          Auto-post check-ins to Facebook, Instagram & LinkedIn.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            if (!transpondConfigured) {
                              setShowSocialWarningModal(true);
                            } else {
                              window.open("https://www.facebook.com/v15.0/dialog/oauth?client_id=3446478465675846&redirect_uri=https%3A%2F%2Fweb.mpzmail.com%2Fcp%2Fcompany%2Fintegrations%2FoAuth%2Fresponse%2F77&state=&scope=pages_show_list%2Cleads_retrieval%2Cpages_read_engagement%2Cpages_manage_posts%2Cinstagram_basic%2Cinstagram_content_publish%2Cbusiness_management%2Cread_insights%2Cinstagram_manage_insights%2Cpages_manage_metadata%2Cpages_messaging", "_blank");
                            }
                          }}
                          className="btn btn-outline"
                          style={{ width: "100%", fontSize: "0.75rem", height: "36px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(255, 255, 255, 0.02)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}
                        >
                          {!transpondConfigured ? "🔒 Unlock Feature" : "🔌 Connect Social Pages"}
                        </button>
                      </div>
                    )}
                  </div>



                </div>
              </div>
            </div>
            </>
           )}

          {/* Google Business API Instructions Modal */}
          {showGoogleModal && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "1.5rem",
              backdropFilter: "blur(8px)"
            }}>
              <div className="double-bezel-wrapper" style={{ maxWidth: "600px", width: "100%", height: "auto", maxHeight: "90vh", overflowY: "auto" }}>
                <div className="double-bezel-inner" style={{ padding: "2rem", position: "relative" }}>
                  <button 
                    onClick={() => setShowGoogleModal(false)}
                    style={{
                      position: "absolute",
                      top: "1.25rem",
                      right: "1.25rem",
                      background: "none",
                      border: "none",
                      color: "#ffffff",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      opacity: 0.7,
                      transition: "opacity 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = "1"}
                    onMouseOut={(e) => e.currentTarget.style.opacity = "0.7"}
                  >
                    ✕
                  </button>
                  
                  <h3 style={{ color: "#ffffff", fontSize: "1.25rem", fontWeight: "900", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    🌐 Google My Business Sync Setup
                  </h3>
                  
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                    Follow these steps in your Google Cloud Console to enable automatic posting of check-ins directly to your Google Business Profile (Google Maps card):
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.8rem", color: "#ffffff", lineHeight: "1.6", textAlign: "left" }}>
                    <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <strong style={{ color: "#e2b047", display: "block", marginBottom: "4px" }}>Step 1: Open Google Cloud Console</strong>
                      Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "#e2b047", textDecoration: "underline" }}>console.cloud.google.com</a> and sign in with the Google Account that manages the business maps profile. Create a new project (e.g., "PinDrop SEO").
                    </div>

                    <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <strong style={{ color: "#e2b047", display: "block", marginBottom: "4px" }}>Step 2: Request Access to Business Profile APIs</strong>
                      Search for and enable the <strong>My Business Account Management API</strong> and <strong>My Business Business Information API</strong>.
                      <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "4px" }}>
                        *Note: Because this API is restricted to prevent Google Maps spam, Google Cloud requires you to submit a quick request form. It usually takes 2-3 business days to get access approval.
                      </span>
                    </div>

                    <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <strong style={{ color: "#e2b047", display: "block", marginBottom: "4px" }}>Step 3: Create OAuth Credentials</strong>
                      Go to <strong>APIs & Services &gt; Credentials</strong>. Create an "OAuth Client ID" (select "Web Application"). 
                      Add your deployment domains (e.g., `https://lungrinslawncare.com` and `http://localhost:3000`) under **Authorized Javascript Origins** and **Authorized Redirect URIs**.
                    </div>

                    <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <strong style={{ color: "#e2b047", display: "block", marginBottom: "4px" }}>Step 4: Save API Credentials to App</strong>
                      Add your Client ID and Client Secret to the server configuration (`.env.local`):
                      <pre style={{ margin: "8px 0 0 0", padding: "8px", background: "#0a0f1d", color: "#8ab4f8", fontSize: "0.75rem", overflowX: "auto", borderRadius: "4px" }}>
                        GOOGLE_CLIENT_ID=your_id_here{"\n"}
                        GOOGLE_CLIENT_SECRET=your_secret_here
                      </pre>
                    </div>
                  </div>

                  {/* Mock GBP Post Preview Card */}
                  <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem" }}>
                    <h4 style={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "700", marginBottom: "0.75rem", textAlign: "left" }}>
                      📸 Google Maps Post Preview (Example):
                    </h4>
                    <div style={{ background: "#ffffff", color: "#1f2937", borderRadius: "12px", padding: "16px", textAlign: "left", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", maxWidth: "420px", margin: "0 auto" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", color: "#e2b047", fontWeight: "bold", fontSize: "0.8rem" }}>
                          {(companyName || "Our Company").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <strong style={{ fontSize: "0.85rem", color: "#111827", display: "block" }}>{companyName || "Our Company"}</strong>
                          <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>Google Maps Update • Just now</span>
                        </div>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "#374151", margin: "0 0 12px 0", lineHeight: "1.4" }}>
                        📍 <strong>Location Name</strong><br/>
                        Completed a premium quality installation, replacing old worn materials with heavy-duty weather barriers and finishing with professional workmanship...
                      </p>
                      <div style={{ width: "100%", height: "180px", borderRadius: "8px", background: "rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "#6b7280", border: "1px dashed rgba(0,0,0,0.15)" }}>Project Photos</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowGoogleModal(false)}
                    className="btn btn-outline"
                    style={{ width: "100%", marginTop: "1.5rem", height: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    Close Setup Instructions
                  </button>
                </div>
              </div>
            </div>
          )}

           {/* Social Media Subscription Warning Modal */}
           {showSocialWarningModal && (
             <div style={{
               position: "fixed",
               top: 0,
               left: 0,
               width: "100%",
               height: "100%",
               backgroundColor: "rgba(0, 0, 0, 0.85)",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               zIndex: 9999,
               padding: "1.5rem",
               backdropFilter: "blur(8px)"
             }}>
               <div className="double-bezel-wrapper" style={{ maxWidth: "500px", width: "100%", height: "auto" }}>
                 <div className="double-bezel-inner" style={{ padding: "2rem", position: "relative", textAlign: "left" }}>
                   <button 
                     onClick={() => setShowSocialWarningModal(false)}
                     style={{
                       position: "absolute",
                       top: "1.25rem",
                       right: "1.25rem",
                       background: "none",
                       border: "none",
                       color: "#ffffff",
                       fontSize: "1.5rem",
                       cursor: "pointer",
                       opacity: 0.7
                     }}
                   >
                     ✕
                   </button>
                   
                   <h3 style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: "900", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                     ⚠️ Subscription Required
                   </h3>
                   
                   <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                     Automating social media posts requires active subscriptions to <strong>Capsule CRM</strong> and <strong>Transpond</strong> (approx. $50.00/mo combined) to handle background automations.
                   </p>

                   <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "1.5rem" }}>
                     <a 
                       href="https://get.capsulenow.io/w87ng8tquqti" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="btn btn-outline" 
                       style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "40px", fontSize: "0.8rem", color: "#e2b047", border: "1px solid #e2b047" }}
                     >
                       🚀 Sign up for Capsule CRM
                     </a>
                     <a 
                       href="https://get.capsulenow.io/h70zife95sd6-no30m" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="btn btn-outline" 
                       style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "40px", fontSize: "0.8rem", color: "#e2b047", border: "1px solid #e2b047" }}
                     >
                       🚀 Sign up for Transpond Social
                     </a>
                   </div>

                   <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.02)", padding: "10px 12px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)" }}>
                     <strong>Already have accounts?</strong><br/>
                     Copy your API Key and Group ID from your Transpond settings and save them under the **Transpond CRM** card to instantly unlock this feature!
                   </div>
                 </div>
               </div>
             </div>
           )}

            {/* Interactive Tour Overlay */}
            {tourStep !== null && (
              <div style={{
                position: "fixed",
                bottom: "2rem",
                right: "2rem",
                zIndex: 10000,
                maxWidth: "360px",
                width: "calc(100% - 4rem)",
                backgroundColor: "#111827",
                border: "2px solid #e2b047",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5), 0 0 10px rgba(226, 176, 71, 0.2)",
                padding: "1.25rem",
                textAlign: "left"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "1px", color: "#e2b047", fontWeight: "bold" }}>
                    App Walkthrough ({tourStep}/5)
                  </span>
                  <button 
                    onClick={handleFinishTour}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.9rem" }}
                  >
                    ✕
                  </button>
                </div>
                
                <div style={{ fontSize: "0.82rem", color: "#ffffff", lineHeight: "1.5", marginBottom: "1.25rem" }}>
                  {tourStep === 1 && (
                    <div>
                      {activeClientId === "lungrins-lawncare" ? (
                        <>
                          <strong>🏢 Step 1: Add Your Business</strong><br/><br/>
                          To launch a private map and embed widgets on your own website, you must register your company. Scroll down and fill out the fields in the <strong>Company Profile Settings</strong> tab, or click the <strong>Register Your Business</strong> button at the top!
                        </>
                      ) : (
                        <>
                          <strong>🏢 Step 1: Company Profile Settings</strong><br/><br/>
                          This panel allows you to customize your company profile details. Scroll down to update your company name, update your team member lists, change your passcode, or edit company branding!
                        </>
                      )}
                    </div>
                  )}
                  {tourStep === 2 && (
                    <div>
                      <strong>👥 Step 2: Select Team Member</strong><br/><br/>
                      Select your active crew name from the <strong>Team Member</strong> dropdown and input your job city location to start pinning jobs.
                    </div>
                  )}
                  {tourStep === 3 && (
                    <div>
                      <strong>🌐 Step 3: Google Maps Sync</strong><br/><br/>
                      Connect your Google Business Profile so that check-ins dropped here automatically post as local updates on Google Maps.
                    </div>
                  )}
                  {tourStep === 4 && (
                    <div>
                      <strong>📋 Step 4: Transpond CRM Link</strong><br/><br/>
                      Paste your Transpond CRM API Key and Group ID to automatically email or text feedback and review request invites to customers!
                    </div>
                  )}
                  {tourStep === 5 && (
                    <div>
                      <strong>📱 Step 5: Social Auto-Post</strong><br/><br/>
                      Once your CRM keys are linked, connect your Meta Pages to auto-publish every dropped pin straight to your Facebook and Instagram feeds!
                    </div>
                  )}
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button 
                    onClick={handleFinishTour}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer", padding: 0 }}
                  >
                    Skip Tour
                  </button>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {tourStep > 1 && (
                      <button 
                        onClick={() => {
                          const prevStep = tourStep - 1;
                          setTourStep(prevStep);
                          if (prevStep === 1) setExpandedTab("company");
                          if (prevStep === 2) setExpandedTab(null);
                          if (prevStep === 3) setExpandedTab("google");
                          if (prevStep === 4) setExpandedTab("crm");
                          if (prevStep === 5) setExpandedTab("social");
                        }}
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "4px 12px", borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer" }}
                      >
                        Back
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        if (tourStep < 5) {
                          const nextStep = tourStep + 1;
                          setTourStep(nextStep);
                          if (nextStep === 2) setExpandedTab(null);
                          if (nextStep === 3) setExpandedTab("google");
                          if (nextStep === 4) setExpandedTab("crm");
                          if (nextStep === 5) setExpandedTab("social");
                        } else {
                          handleFinishTour();
                        }
                      }}
                      style={{ background: "#e2b047", border: "none", color: "#000", padding: "4px 14px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold", cursor: "pointer" }}
                    >
                      {tourStep === 5 ? "Finish" : "Next"}
                    </button>
                  </div>
                </div>
              </div>
            )}

       </div>

      <style jsx>{`
        .portal-container {
          background: var(--bg);
          padding: 5rem 0;
          min-height: 90vh;
        }
        .portal-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 3rem;
        }
        .eyebrow {
          color: var(--secondary);
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }
        .portal-header h1 {
          color: #ffffff;
          margin: 0.25rem 0 0.5rem;
          font-size: 2.2rem;
          font-weight: 800;
        }
        .subtitle {
          color: var(--text-muted);
          font-size: 1rem;
          line-height: 1.5;
        }
        .form-card {
          max-width: 580px;
          margin: 0 auto;
        }
        .form-inner {
          padding: 2.5rem !important;
        }
        .portal-form {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-label {
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: #ffffff;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          border-color: var(--secondary);
        }
        .form-input:disabled {
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-muted);
          cursor: not-allowed;
        }
        select.form-input {
          cursor: pointer;
        }
        select.form-input option {
          background: #0f172a;
          color: #ffffff;
        }
        .textarea {
          resize: vertical;
          line-height: 1.5;
        }
        .gps-row {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }
        .gps-btn {
          flex-shrink: 0;
          font-size: 0.8rem;
          padding: 0.6rem 1.2rem !important;
          background: rgba(226, 176, 71, 0.05);
        }
        .coords-display {
          display: flex;
          gap: 1rem;
          flex-grow: 1;
        }
        .coord-field {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          flex-grow: 1;
        }
        .coord-input {
          width: 100%;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 600;
          outline: none;
        }
        .convert-btn {
          background: var(--secondary);
          color: #0f172a;
          border: 1px solid var(--secondary);
          border-radius: 8px;
          padding: 0.75rem 1.25rem;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }
        .convert-btn:hover {
          background: #ffffff;
          border-color: #ffffff;
          color: #0f172a;
          box-shadow: 0 4px 12px rgba(226, 176, 71, 0.25);
        }
        .convert-btn:disabled {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--border);
          color: var(--text-muted);
          cursor: not-allowed;
        }
        
        .upload-hidden-input {
          display: none;
        }
        .upload-buttons-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
        }
        .upload-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.9rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
          text-align: center;
          transition: all 0.2s ease-in-out;
          cursor: pointer;
        }
        .upload-btn.disabled {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: var(--border) !important;
          color: var(--text-muted) !important;
          cursor: not-allowed !important;
        }
        .primary-upload-btn {
          background: var(--secondary);
          color: #0f172a;
          border: 1px solid var(--secondary);
        }
        .primary-upload-btn:hover {
          background: #ffffff;
          border-color: #ffffff;
          color: #0f172a;
          box-shadow: 0 4px 12px rgba(226, 176, 71, 0.25);
        }
        .outline-upload-btn {
          background: rgba(255, 255, 255, 0.01);
          color: #ffffff;
          border: 2px dashed rgba(226, 176, 71, 0.25);
        }
        .outline-upload-btn:hover {
          background: rgba(226, 176, 71, 0.05);
          border-color: var(--secondary);
          color: var(--secondary);
        }
        .preview-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-top: 1rem;
        }
        .preview-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .preview-remove {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(15, 23, 42, 0.85);
          border: none;
          color: #ffffff;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .preview-remove:hover {
          background: #ef4444;
        }
        .submit-error {
          color: #ef4444;
          font-size: 0.85rem;
          text-align: center;
          margin: 0;
          font-weight: 600;
        }
        .submit-form-btn {
          width: 100%;
          padding: 0.9rem !important;
          font-size: 0.95rem;
          font-weight: 700;
          margin-top: 0.5rem;
        }
        
        /* Success Card Styles */
        .success-card {
          max-width: 500px;
          margin: 0 auto;
        }
        .success-inner {
          padding: 3rem !important;
          text-align: center;
        }
        .success-icon {
          font-size: 3.5rem;
          display: block;
          margin-bottom: 1.25rem;
        }
        .success-inner h3 {
          color: var(--primary);
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }
        .success-inner p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .success-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
}
