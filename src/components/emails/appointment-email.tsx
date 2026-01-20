import { Tailwind, Html, Head, Body, Container, Heading, Text } from "@react-email/components";

interface EmailProps {
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: "CONFIRMATION" | "CREATED" | "CANCELLED";
  reason?: string;
}

export const AppointmentEmail = ({ patientName, doctorName, date, time, type, reason }: EmailProps) => {
  let headerColor = "#2563eb";
  let title = "Permintaan Diterima";

  if (type === "CONFIRMATION") {
    headerColor = "#16a34a"; // Green
    title = "Jadwal Terkonfirmasi! ✅";
  } else if (type === "CANCELLED") {
    headerColor = "#dc2626"; // Red
    title = "Jadwal Dibatalkan ❌";
  }

  return (
    <Tailwind>
      <Html lang="en">
        <Head />

        <Body className="font-sans">
          <Container>
            <Heading style={{ color: headerColor }}>{title}</Heading>
            <Text>
              Halo <strong>{patientName}</strong>,
            </Text>

            {type === "CANCELLED" ? <Text> Mohon maaf, jadwal konsultasi Anda harus kami batalkan.</Text> : <Text>Berikut adalah detail jadwal konsultasi Anda:</Text>}

            <div style={{ background: "#f3f4f6", padding: "15px", borderRadius: "8px", margin: "20px 0" }}>
              <p style={{ margin: "5px 0" }}>
                👨‍⚕️ <strong>Dokter:</strong> {doctorName}
              </p>
              <p style={{ margin: "5px 0" }}>
                📅 <strong>Tanggal:</strong> {date}
              </p>
              <p style={{ margin: "5px 0" }}>
                ⏰ <strong>Jam:</strong> {time}
              </p>

              {type === "CANCELLED" && reason && (
                <div style={{ marginTop: "15px", padding: "10px", background: "#fef2f2", borderLeft: "4px solid #dc2626", color: "#b91c1c" }}>
                  <strong>Alasan Pembatalan:</strong>
                  <br />
                  {reason}
                </div>
              )}
            </div>

            <Text>Ini adalah email otomatis dari Sistem Klinik Sehat. Mohon jangan membalas email ini.</Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};
