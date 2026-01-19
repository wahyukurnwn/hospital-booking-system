import { Tailwind, Html, Head, Body, Container, Heading, Text } from "@react-email/components";

interface EmailProps {
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: "CONFIRMATION" | "CREATED";
}

export const AppointmentEmail = ({ patientName, doctorName, date, time, type }: EmailProps) => {
  const isConfirmation = type === "CONFIRMATION";

  return (
    <Tailwind>
      <Html lang="en">
        <Head />

        <Body className="font-sans">
          <Container>
            <Heading style={{ color: isConfirmation ? "#16a34a" : "#2563eb" }}>{isConfirmation ? "Jadwal Terkonfirmasi ✅" : "Permintaan Jadwal Diterima ⏳"}</Heading>
            <Text>
              Halo <strong>{patientName}</strong>,
            </Text>

            <Text>{isConfirmation ? "Kabar baik! Dokter telah mengkonfirmasi jadwal konsultasi Anda." : "Kami telah menerima permintaan booking Anda. Mohon tunggu konfirmasi dari Admin kami."}</Text>

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
            </div>

            <Text>Ini adalah email otomatis dari Sistem Klinik Sehat. Mohon jangan membalas email ini.</Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};
