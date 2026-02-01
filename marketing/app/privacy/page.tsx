import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <Container size="md">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: January 31, 2026
            </p>
          </div>

          <div className="prose prose-invert prose-gray max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-muted-foreground mb-4">
                Ball Up Top ("we," "our," or "us") is committed to protecting
                your privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our mobile
                application and website (collectively, the "Service").
              </p>
              <p className="text-muted-foreground">
                Please read this Privacy Policy carefully. By using the Service,
                you agree to the collection and use of information in accordance
                with this policy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">
                Information We Collect
              </h2>

              <h3 className="text-lg font-medium mb-3">
                Personal Information
              </h3>
              <p className="text-muted-foreground mb-4">
                When you create an account, we may collect:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-1">
                <li>Name and display name</li>
                <li>Email address</li>
                <li>Profile photo</li>
                <li>Height and playing position (optional)</li>
              </ul>

              <h3 className="text-lg font-medium mb-3">Location Data</h3>
              <p className="text-muted-foreground mb-4">
                With your permission, we collect location data to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-1">
                <li>Show basketball courts near your current location</li>
                <li>Enable check-ins at courts</li>
                <li>Calculate distances to courts</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                You can disable location services at any time through your
                device settings, though this may limit certain features.
              </p>

              <h3 className="text-lg font-medium mb-3">Usage Data</h3>
              <p className="text-muted-foreground mb-4">
                We automatically collect information about how you use the
                Service, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Check-in history and game time</li>
                <li>Player ratings you give and receive</li>
                <li>Courts you visit and save</li>
                <li>Device information and app usage patterns</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">
                How We Use Your Information
              </h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Provide, maintain, and improve the Service</li>
                <li>Create and manage your account</li>
                <li>Display nearby courts and player information</li>
                <li>Calculate and display player ratings and leaderboards</li>
                <li>Send notifications about your activity and achievements</li>
                <li>Respond to your requests and support inquiries</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">
                Information Sharing
              </h2>
              <p className="text-muted-foreground mb-4">
                We may share your information in the following circumstances:
              </p>

              <h3 className="text-lg font-medium mb-3">With Other Users</h3>
              <p className="text-muted-foreground mb-6">
                Your profile information (name, photo, ratings, archetype) is
                visible to other users. Your check-in activity may be visible to
                users viewing the same court.
              </p>

              <h3 className="text-lg font-medium mb-3">Service Providers</h3>
              <p className="text-muted-foreground mb-6">
                We may share information with third-party service providers who
                perform services on our behalf, such as hosting, analytics, and
                customer support.
              </p>

              <h3 className="text-lg font-medium mb-3">Legal Requirements</h3>
              <p className="text-muted-foreground">
                We may disclose your information if required by law or in
                response to valid legal requests from public authorities.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no
                method of transmission over the Internet or electronic storage
                is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal information for as long as your account
                is active or as needed to provide you services. You can request
                deletion of your account and data at any time through the app
                settings.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have certain rights
                regarding your personal information, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Access to your personal data</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of your data</li>
                <li>Data portability</li>
                <li>Objection to certain processing</li>
                <li>Withdrawal of consent</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground">
                The Service is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If we learn we have collected information from a child
                under 13, we will delete that information promptly.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">
                Changes to This Policy
              </h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. You are advised
                to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us at:
              </p>
              <p className="text-muted-foreground">
                <a
                  href="mailto:support@balluptop.com"
                  className="text-white hover:underline"
                >
                  support@balluptop.com
                </a>
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
