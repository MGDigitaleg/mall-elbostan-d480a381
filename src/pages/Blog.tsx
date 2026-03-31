import { MainLayout } from "@/components/layout/MainLayout";

const Blog = () => (
  <MainLayout>
    <div className="container py-20">
      <h1 className="text-4xl font-bold text-gradient-gold mb-4">المدونة</h1>
      <p className="text-muted-foreground">آخر الأخبار والمقالات عن التكنولوجيا والمول.</p>
    </div>
  </MainLayout>
);

export default Blog;
