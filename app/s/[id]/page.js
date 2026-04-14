// app/s/[id]/page.js
// Scanner page — captures photo, GPS, logs scan to Firestore,
// uploads photo to Firebase Storage, then moves to soothing page.

'use client';

import { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/src/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadString } from "firebase/storage";

export default function ScannerPage() {
  const { id } = useParams();
  const router = useRouter();
  const videoRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [gps, setGps] = useState(null);

  useEffect(() => {
  startCamera();
  captureGPS();
  sendInstantAlert();
    }, []);

    async function sendInstantAlert() {
      try {
        await fetch("/api/scan-alert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tagId: id,
            gps: null, // GPS not ready yet, will update later
            photoUrl: null
          })
        });
      } catch (err) {
        // Silent fail — never show error to scanner
        console.error(err);
      }
    }

  // Get finder's GPS location silently
  function captureGPS() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      () => {} // silently fail if denied
    );
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      videoRef.current.srcObject = stream;
      setCameraReady(true);
    } catch (err) {
      setError("क्यामेरा खुल्न सकेन। / Could not open camera.");
    }
  }

  function takePhoto() {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setPhoto(dataUrl);
  }

  // Upload photo + log scan when finder confirms photo
  async function confirmAndProceed() {
  setUploading(true);

  try {
    // Log the scan in Firestore (no photo upload for now)
    await addDoc(collection(db, "scans"), {
      tagId: id,
      timestamp: serverTimestamp(),
      photoUrl: null,
      gps: gps || null,
      deviceInfo: navigator.userAgent,
    });
    

    // Move to soothing page
    router.push(`/s/${id}/help?lat=${gps?.lat || ""}&lng=${gps?.lng || ""}`);

  } catch (err) {
    console.error(err);
    setUploading(false);
    setError(err.message);
  }
}

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fdf6ec 0%, #fdebd0 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "sans-serif"
    }}>

      {/* Brand */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "22px", color: "#c0392b", fontWeight: "bold", margin: 0 }}>
          🏷️ Usafe-Tags
        </h1>
        <p style={{ color: "#888", fontSize: "13px", margin: "4px 0 0 0" }}>
          Safety Tag System
        </p>
      </div>

      {/* Instruction */}
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "20px",
        textAlign: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        maxWidth: "360px",
        width: "100%"
      }}>
        <p style={{ fontSize: "20px", color: "#2c3e50", margin: "0 0 8px 0" }}>
          📸 कृपया एउटा फोटो खिच्नुहोस्
        </p>
        <p style={{ fontSize: "15px", color: "#555", margin: 0 }}>
          Please take a photo to help us locate this person
        </p>
      </div>

      {/* Camera or photo preview */}
      {!photo ? (
        <div style={{ width: "100%", maxWidth: "360px" }}>
          {error ? (
            <div style={{
              background: "#fff3f3",
              border: "1px solid #f5c6cb",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              color: "#c0392b"
            }}>
              {error}
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: "100%",
                  borderRadius: "16px",
                  background: "#000",
                  display: "block"
                }}
              />
              {cameraReady && (
                <button
                  onClick={takePhoto}
                  style={{
                    marginTop: "16px",
                    width: "100%",
                    padding: "16px",
                    fontSize: "18px",
                    background: "#e67e22",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  📷 फोटो खिच्नुहोस् / Take Photo
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <div style={{ width: "100%", maxWidth: "360px", textAlign: "center" }}>
          <img
            src={photo}
            alt="captured"
            style={{ width: "100%", borderRadius: "16px" }}
          />

          {uploading ? (
            <p style={{ marginTop: "16px", color: "#e67e22", fontSize: "16px" }}>
              ⏳ अपलोड हुँदैछ... / Uploading...
            </p>
          ) : (
            <>
              <button
                onClick={confirmAndProceed}
                style={{
                  marginTop: "16px",
                  width: "100%",
                  padding: "16px",
                  fontSize: "18px",
                  background: "#27ae60",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                ✅ यो ठिक छ / Use this photo
              </button>
              <button
                onClick={() => setPhoto(null)}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "12px",
                  background: "#ecf0f1",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  color: "#555",
                  fontSize: "15px"
                }}
              >
                🔄 फेरि खिच्नुहोस् / Retake
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}