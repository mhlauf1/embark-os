import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Location } from "@prisma/client";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10 },
  coverPage: { padding: 40, fontFamily: "Helvetica", justifyContent: "center", alignItems: "center" },
  coverTitle: { fontSize: 36, fontFamily: "Helvetica-Bold", marginBottom: 8 },
  coverSubtitle: { fontSize: 14, color: "#666", marginBottom: 4 },
  coverDate: { fontSize: 11, color: "#999", marginTop: 20 },
  sectionTitle: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 12, marginTop: 8 },
  subsectionTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  row: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#ddd", paddingVertical: 4 },
  headerRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#333", paddingBottom: 4, marginBottom: 4 },
  cell: { flex: 1, fontSize: 9 },
  cellBold: { flex: 1, fontSize: 9, fontFamily: "Helvetica-Bold" },
  cellSmall: { flex: 0.6, fontSize: 9, textAlign: "center" },
  cellSmallBold: { flex: 0.6, fontSize: 9, fontFamily: "Helvetica-Bold", textAlign: "center" },
  summaryBox: { backgroundColor: "#F4F1EC", padding: 12, borderRadius: 4, marginBottom: 16 },
  summaryRow: { flexDirection: "row", marginBottom: 4 },
  summaryLabel: { fontSize: 10, color: "#666", width: 140 },
  summaryValue: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  locationCard: { marginBottom: 12, padding: 10, borderWidth: 0.5, borderColor: "#ddd", borderRadius: 4 },
  locationName: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  locationMeta: { fontSize: 9, color: "#666", marginBottom: 6 },
  servicesRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 4 },
  servicePill: { backgroundColor: "#eee", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, fontSize: 8 },
  scoresRow: { flexDirection: "row", gap: 12, marginTop: 4 },
  scoreItem: { alignItems: "center" },
  scoreValue: { fontSize: 14, fontFamily: "Helvetica-Bold" },
  scoreLabel: { fontSize: 7, color: "#666" },
  check: { fontSize: 10, color: "#4A9A6E" },
  dash: { fontSize: 10, color: "#ccc" },
  matrixCell: { width: 50, textAlign: "center", fontSize: 9 },
  matrixNameCell: { width: 120, fontSize: 9 },
  footer: { position: "absolute", bottom: 20, left: 40, right: 40, fontSize: 8, color: "#999", textAlign: "center" },
});

const SERVICE_KEYS = [
  "serviceBoarding", "serviceDaycare", "serviceGrooming", "serviceTraining",
  "serviceVetCare", "serviceGroomingEd", "serviceWebcams", "serviceMobileGroom", "serviceRetail",
] as const;

const SERVICE_SHORT = ["Board", "Day", "Groom", "Train", "Vet", "GrmEd", "Cam", "Mobile", "Retail"];

interface ReportData {
  locations: Location[];
  generatedAt: string;
}

export function PortfolioReport({ locations, generatedAt }: ReportData) {
  const total = locations.length;
  const ratedLocations = locations.filter((l) => l.googleRating !== null);
  const avgRating = ratedLocations.length > 0
    ? (ratedLocations.reduce((s, l) => s + l.googleRating!, 0) / ratedLocations.length).toFixed(1)
    : "N/A";
  const totalReviews = ratedLocations.reduce((s, l) => s + (l.googleReviewCount ?? 0), 0);
  const migrationsComplete = locations.filter((l) => l.migrationStatus === "complete").length;
  const rebuildsLive = locations.filter((l) => l.rebuildStatus === "live").length;
  const uniqueStates = new Set(locations.map((l) => l.state)).size;

  return (
    <Document>
      {/* Cover Page */}
      <Page size="LETTER" style={styles.coverPage}>
        <Text style={styles.coverTitle}>Embark OS</Text>
        <Text style={styles.coverSubtitle}>Portfolio Report</Text>
        <Text style={styles.coverSubtitle}>Embark Pet Services</Text>
        <Text style={styles.coverDate}>Generated {generatedAt}</Text>
      </Page>

      {/* Summary Page */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionTitle}>Portfolio Summary</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Locations</Text>
            <Text style={styles.summaryValue}>{total} across {uniqueStates} states</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Avg Google Rating</Text>
            <Text style={styles.summaryValue}>{avgRating} ({totalReviews.toLocaleString()} reviews)</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Migrations Complete</Text>
            <Text style={styles.summaryValue}>{migrationsComplete} / {total}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rebuilds Live</Text>
            <Text style={styles.summaryValue}>{rebuildsLive} / {total}</Text>
          </View>
        </View>

        {/* Service Coverage Matrix */}
        <Text style={styles.subsectionTitle}>Service Coverage Matrix</Text>
        <View style={styles.headerRow}>
          <Text style={styles.matrixNameCell}>Location</Text>
          {SERVICE_SHORT.map((s) => (
            <Text key={s} style={styles.matrixCell}>{s}</Text>
          ))}
        </View>
        {locations.map((loc) => (
          <View key={loc.id} style={styles.row}>
            <Text style={styles.matrixNameCell}>{loc.name}</Text>
            {SERVICE_KEYS.map((key) => (
              <Text key={key} style={styles.matrixCell}>
                {loc[key] ? "+" : "-"}
              </Text>
            ))}
          </View>
        ))}
        <Text style={styles.footer}>Embark OS - Portfolio Report - {generatedAt}</Text>
      </Page>

      {/* Location Snapshots */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionTitle}>Location Snapshots</Text>
        {locations.map((loc) => {
          const services = SERVICE_KEYS.filter((k) => loc[k]).map(
            (k, i) => SERVICE_SHORT[SERVICE_KEYS.indexOf(k)]
          );
          return (
            <View key={loc.id} style={styles.locationCard} wrap={false}>
              <Text style={styles.locationName}>{loc.name}</Text>
              <Text style={styles.locationMeta}>
                {loc.city}, {loc.state}
                {loc.googleRating ? ` | ${loc.googleRating.toFixed(1)} stars (${loc.googleReviewCount} reviews)` : ""}
              </Text>
              {services.length > 0 && (
                <View style={styles.servicesRow}>
                  {services.map((s) => (
                    <Text key={s} style={styles.servicePill}>{s}</Text>
                  ))}
                </View>
              )}
              {loc.lighthousePerf !== null && (
                <View style={styles.scoresRow}>
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreValue}>{loc.lighthousePerf}</Text>
                    <Text style={styles.scoreLabel}>Perf</Text>
                  </View>
                  {loc.lighthouseA11y !== null && (
                    <View style={styles.scoreItem}>
                      <Text style={styles.scoreValue}>{loc.lighthouseA11y}</Text>
                      <Text style={styles.scoreLabel}>A11y</Text>
                    </View>
                  )}
                  {loc.lighthouseSEO !== null && (
                    <View style={styles.scoreItem}>
                      <Text style={styles.scoreValue}>{loc.lighthouseSEO}</Text>
                      <Text style={styles.scoreLabel}>SEO</Text>
                    </View>
                  )}
                  {loc.lighthouseBP !== null && (
                    <View style={styles.scoreItem}>
                      <Text style={styles.scoreValue}>{loc.lighthouseBP}</Text>
                      <Text style={styles.scoreLabel}>BP</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}
        <Text style={styles.footer}>Embark OS - Portfolio Report - {generatedAt}</Text>
      </Page>

      {/* Pipeline Status */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionTitle}>Pipeline Status</Text>

        <Text style={styles.subsectionTitle}>Migration Pipeline</Text>
        <View style={styles.headerRow}>
          <Text style={styles.cellBold}>Location</Text>
          <Text style={styles.cellSmallBold}>Status</Text>
        </View>
        {locations.map((loc) => (
          <View key={loc.id} style={styles.row}>
            <Text style={styles.cell}>{loc.name}</Text>
            <Text style={styles.cellSmall}>{loc.migrationStatus}</Text>
          </View>
        ))}

        <Text style={{ ...styles.subsectionTitle, marginTop: 20 }}>Rebuild Pipeline</Text>
        <View style={styles.headerRow}>
          <Text style={styles.cellBold}>Location</Text>
          <Text style={styles.cellSmallBold}>Status</Text>
        </View>
        {locations.map((loc) => (
          <View key={loc.id} style={styles.row}>
            <Text style={styles.cell}>{loc.name}</Text>
            <Text style={styles.cellSmall}>{loc.rebuildStatus}</Text>
          </View>
        ))}
        <Text style={styles.footer}>Embark OS - Portfolio Report - {generatedAt}</Text>
      </Page>
    </Document>
  );
}
