import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  EmptyState,
  Input,
  SectionHeading,
  Select,
  Skeleton,
  Textarea,
} from "@/components/ui";

export default function DesignSystemPage() {
  return (
    <div className="section-space">
      <Container className="content-stack">
        <SectionHeading
          eyebrow="Design System"
          title="Reusable UI foundation for storefront and admin"
          description="These components use the shared ecommerce brand palette, spacing rhythm, and variant system so both customer and back-office screens stay visually consistent."
          actions={
            <>
              <Button variant="primary">Primary CTA</Button>
              <Button variant="secondary">Accent CTA</Button>
              <Button variant="outline">Outline Action</Button>
            </>
          }
        />

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card variant="primary">
            <CardHeader>
              <Badge>Buttons</Badge>
              <CardTitle>Action hierarchy</CardTitle>
              <CardDescription>
                Use the primary button for major conversion actions and the accent
                button for campaign or promotional emphasis.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="primary">Shop New Arrivals</Button>
              <Button variant="secondary">Claim Offer</Button>
              <Button variant="outline">Save for Later</Button>
              <Button variant="danger">Delete Product</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Badge variant="secondary">Badges</Badge>
              <CardTitle>Quick status labels</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Badge variant="primary">Featured</Badge>
              <Badge variant="secondary">Hot Deal</Badge>
              <Badge variant="outline">Draft</Badge>
              <Badge variant="danger">Low Stock</Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Badge variant="outline">Forms</Badge>
              <CardTitle>Inputs and controls</CardTitle>
              <CardDescription>
                A clean form language for checkout steps, admin settings, and content
                management interfaces.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email address
                </label>
                <Input id="email" placeholder="name@example.com" variant="primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="category">
                  Category
                </label>
                <Select defaultValue="fashion" id="category" variant="outline">
                  <option value="fashion">Fashion</option>
                  <option value="home">Home</option>
                  <option value="beauty">Beauty</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="notes">
                  Notes
                </label>
                <Textarea
                  id="notes"
                  placeholder="Add internal notes, onboarding copy, or a customer-facing message..."
                />
              </div>
            </CardContent>
          </Card>

          <Card variant="secondary">
            <CardHeader>
              <Badge variant="primary">Patterns</Badge>
              <CardTitle>Empty state and loading</CardTitle>
              <CardDescription>
                Shared patterns for unfinished states, first-run experiences, and data
                loading placeholders.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <EmptyState
                title="No featured collection yet"
                description="Create a collection to spotlight seasonal products, promotions, or campaign inventory."
                action={<Button size="sm">Create Collection</Button>}
              />
              <div className="space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-28 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
