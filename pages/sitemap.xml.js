/*
 * @Author: Qifan Sun
 * @Date: 2023-07-23 22:18:28
 * @LastEditors: Qifan Sun
 * @LastEditTime: 2023-11-20 15:09:35
 * @FilePath: sitemap.xml.js
 * @Description: 
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-07-23 22:18:28
 */
// pages/sitemap.xml.js
import { getServerSideSitemap } from 'next-sitemap'
import { getGlobalData } from '@/lib/notion/getNotionData'
import BLOG from '@/blog.config'

export const getServerSideProps = async (ctx) => {
  const { allPages } = await getGlobalData({ from: 'rss' })
  const defaultFields = [
    {
      loc: `${BLOG.LINK}`,
      changefreq: 'daily',
      priority: '0.7',
      lastmod: new Date().toISOString()
    }, {
      loc: `${BLOG.LINK}/archive`,
      changefreq: 'daily',
      priority: '0.7',
      lastmod: new Date().toISOString()
    }, {
      loc: `${BLOG.LINK}/sitemap.xml`,
      changefreq: 'daily',
      priority: '0.7',
      lastmod: new Date().toISOString()
    }, {
      loc: `${BLOG.LINK}/category`,
      changefreq: 'daily',
      priority: '0.7',
      lastmod: new Date().toISOString()
    }, {
      loc: `${BLOG.LINK}/feed`,
      changefreq: 'daily',
      priority: '0.7',
      lastmod: new Date().toISOString()
    }, {
      loc: `${BLOG.LINK}/search`,
      changefreq: 'daily',
      priority: '0.7',
      lastmod: new Date().toISOString()
    }, {
      loc: `${BLOG.LINK}/tag`,
      changefreq: 'daily',
      priority: '0.7',
      lastmod: new Date().toISOString()
    }
  ]
  const postFields = allPages?.filter(p => p.status === BLOG.NOTION_PROPERTY_NAME.status_publish)?.map(post => {
    const slugWithoutLeadingSlash = post?.slug.startsWith('/') ? post?.slug?.slice(1) : post.slug
    return {
      loc: `${BLOG.LINK}/${slugWithoutLeadingSlash}`,
      changefreq: 'daily',
      priority: '0.7',
      lastmod: new Date(post?.publishDay).toISOString()
    }
  })
  const fields = defaultFields.concat(postFields)

  // 缓存
  ctx.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=59'
  )

  return getServerSideSitemap(ctx, fields)
}

export default () => { }
