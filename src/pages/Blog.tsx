import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildBlogListLd } from "@/components/SEOHead";
import { LoadingGrid, EmptyState } from "@/components/ui/loading-states";

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <MainLayout>
      <SEOHead title="المدونة" titleEn="Blog" description="آخر الأخبار والمقالات عن التكنولوجيا والإلكترونيات ومول البستان في القاهرة الجديدة." descriptionEn="Latest news and articles about technology and Mall Elbostan." keywords="مدونة مول البستان, اخبار التكنولوجيا, مقالات الكترونيات, القاهرة الجديدة, blog" breadcrumbs={[{ name: "المدونة", url: "/blog" }]} jsonLd={posts && posts.length > 0 ? buildBlogListLd(posts) : undefined} />
      <div className="container py-20">
        <h1 className="text-2xl font-bold text-gradient-blue mb-8 md:text-3xl">المدونة</h1>
        {isLoading ? <LoadingGrid /> : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="card-premium overflow-hidden group">
                {post.cover_image_url && <img src={post.cover_image_url} alt={post.title_ar} className="w-full h-48 object-cover" loading="lazy" />}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2">{post.title_ar}</h3>
                  {post.excerpt_ar && <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt_ar}</p>}
                  {post.published_at && <p className="text-xs text-accent mt-3">{new Date(post.published_at).toLocaleDateString("ar-EG")}</p>}
                </div>
              </Link>
            ))}
          </div>
        ) : <EmptyState title="لا توجد مقالات بعد" description="تابعنا لآخر الأخبار والمقالات" />}
      </div>
    </MainLayout>
  );
};

export default Blog;
