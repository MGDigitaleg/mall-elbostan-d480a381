import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildBlogPostLd, buildNewsArticleLd, buildSpeakableLd } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug!).maybeSingle();
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) return <MainLayout><div className="container py-20 text-center text-muted-foreground">جاري التحميل...</div></MainLayout>;
  if (!post) return <MainLayout><div className="container py-20 text-center"><h1 className="text-2xl font-bold mb-4">المقال غير موجود</h1><Link to="/blog"><Button variant="outline-blue">العودة للمدونة</Button></Link></div></MainLayout>;

  return (
    <MainLayout>
      <SEOHead title={post.seo_title_ar ?? post.title_ar} description={post.seo_description_ar ?? post.excerpt_ar ?? ""} type="article" ogImage={post.cover_image_url ?? undefined} keywords={`${post.title_ar}, ${post.category ?? 'تكنولوجيا'}, مول البستان, مدونة`} articlePublishedTime={post.published_at ?? undefined} articleModifiedTime={post.updated_at ?? undefined} breadcrumbs={[{ name: "المدونة", url: "/blog" }, { name: post.title_ar, url: `/blog/${post.slug}` }]} jsonLd={[buildBlogPostLd(post), buildNewsArticleLd(post), buildSpeakableLd(["h1"])]} />
      <article className="container py-20 max-w-3xl">
        <Link to="/blog" className="text-primary text-sm flex items-center gap-1 mb-6 hover:underline"><ArrowRight className="w-4 h-4" /> العودة للمدونة</Link>
        {post.cover_image_url && <img src={post.cover_image_url} alt={post.title_ar} className="w-full h-64 object-cover rounded-xl mb-8" />}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{post.title_ar}</h1>
        {post.published_at && <p className="text-sm text-accent mb-8">{new Date(post.published_at).toLocaleDateString("ar-EG")}</p>}
        <div className="prose prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-line">{post.content_ar}</div>
      </article>
    </MainLayout>
  );
};

export default BlogPost;
