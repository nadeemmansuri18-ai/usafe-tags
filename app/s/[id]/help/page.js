'use client';

import { useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/src/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const TEST_PROFILE = {
  maskedName: "आ***",
  bloodGroup: "B+",
  allergies: "Penicillin",
  medicalNotes: "Non-verbal, has autism",
  guardians: [
    { label: "Guardian १", phone: "+977-9800000001" },
    { label: "Guardian २", phone: "+977-9800000002" },
  ]
};

export default function HelpPage() {
  const { id } = useParams();
  const [helped, setHelped] = useState(false);
  const profile = TEST_PROFILE;

  async function handleImHelping() {
    setHelped(true);
    await addDoc(collection(db, "help_events"), {
      tagId: id,
      timestamp: serverTimestamp(),
    });
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fdf6ec 0%, #fdebd0 100%)", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px", fontFamily: "sans-serif" }}>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", color: "#c0392b", fontWeight: "bold", margin: 0 }}>🏷️ Usafe-Tags</h1>
        <p style={{ color: "#888", fontSize: "13px", margin: "4px 0 0 0" }}>Safety Tag System</p>
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "16px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", width: "100%", maxWidth: "360px" }}>
        <p style={{ fontSize: "28px", margin: "0 0 8px 0" }}>🙏</p>
        <p style={{ fontSize: "20px", color: "#2c3e50", margin: "0 0 6px 0", fontWeight: "bold" }}>धन्यवाद! / Thank you!</p>
        <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>Thank you for helping this person.</p>
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "16px", width: "100%", maxWidth: "360px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <p style={{ fontSize: "16px", color: "#888", margin: "0 0 4px 0" }}>नाम / Name</p>
        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#2c3e50", margin: "0 0 16px 0" }}>{profile.maskedName}</p>

        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
          <div style={{ flex: 1, background: "#fff3f3", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "#888", margin: "0 0 4px 0" }}>Blood Group</p>
            <p style={{ fontSize: "22px", fontWeight: "bold", color: "#c0392b", margin: 0 }}>{profile.bloodGroup}</p>
          </div>
          <div style={{ flex: 1, background: "#fff8f0", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "#888", margin: "0 0 4px 0" }}>Allergies</p>
            <p style={{ fontSize: "15px", fontWeight: "bold", color: "#e67e22", margin: 0 }}>{profile.allergies}</p>
          </div>
        </div>

        <div style={{ background: "#f0f8ff", borderRadius: "12px", padding: "12px" }}>
          <p style={{ fontSize: "12px", color: "#888", margin: "0 0 4px 0" }}>⚕️ Medical Notes</p>
          <p style={{ fontSize: "14px", color: "#2c3e50", margin: 0 }}>{profile.medicalNotes}</p>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "16px", width: "100%", maxWidth: "360px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <p style={{ fontSize: "15px", color: "#555", margin: "0 0 12px 0", textAlign: "center" }}>परिवारलाई सम्पर्क गर्नुहोस् / Contact Family</p>
        <a href="tel:+9779849449844" style={{ display: "block", padding: "14px", marginBottom: "10px", background: "#e8f5e9", borderRadius: "12px", textAlign: "center", fontSize: "17px", fontWeight: "bold", color: "#27ae60", textDecoration: "none" }}>📞 Guardian १</a>
        <a href="tel:+9779849464877" style={{ display: "block", padding: "14px", background: "#e8f5e9", borderRadius: "12px", textAlign: "center", fontSize: "17px", fontWeight: "bold", color: "#27ae60", textDecoration: "none" }}>📞 Guardian २</a>
      </div>

      {!helped ? (
        <button onClick={handleImHelping} style={{ width: "100%", maxWidth: "360px", padding: "18px", fontSize: "20px", background: "#e67e22", color: "white", border: "none", borderRadius: "16px", cursor: "pointer", fontWeight: "bold", marginBottom: "16px" }}>
          🤝 म सहयोग गर्दैछु / I'm Helping
        </button>
      ) : (
        <div style={{ width: "100%", maxWidth: "360px", padding: "18px", background: "#e8f5e9", borderRadius: "16px", textAlign: "center", marginBottom: "16px" }}>
          <p style={{ fontSize: "20px", color: "#27ae60", margin: 0, fontWeight: "bold" }}>✅ सहयोगको लागि धन्यवाद!</p>
          <p style={{ fontSize: "14px", color: "#555", margin: "6px 0 0 0" }}>Family has been notified you are helping.</p>
        </div>
      )}

      <div style={{ background: "white", borderRadius: "16px", padding: "20px", width: "100%", maxWidth: "360px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <p style={{ fontSize: "15px", color: "#555", margin: "0 0 12px 0", textAlign: "center" }}>🚨 Emergency Numbers</p>
        <a href="tel:100" style={{ display: "flex", justifyContent: "space-between", padding: "12px", marginBottom: "8px", background: "#fff3f3", borderRadius: "10px", textDecoration: "none", color: "#c0392b", fontWeight: "bold", fontSize: "16px" }}>
          <span>🚔 Police</span><span>100</span>
        </a>
        <a href="tel:101" style={{ display: "flex", justifyContent: "space-between", padding: "12px", marginBottom: "8px", background: "#fff3f3", borderRadius: "10px", textDecoration: "none", color: "#c0392b", fontWeight: "bold", fontSize: "16px" }}>
          <span>🚒 Fire</span><span>101</span>
        </a>
        <a href="tel:102" style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "#fff3f3", borderRadius: "10px", textDecoration: "none", color: "#c0392b", fontWeight: "bold", fontSize: "16px" }}>
          <span>🚑 Ambulance</span><span>102</span>
        </a>
      </div>

    </div>
  );
}