/*
 * @Author: Qifan Sun
 * @Date: 2023-07-23 22:18:28
 * @LastEditors: Qifan Sun
 * @LastEditTime: 2023-11-16 09:54:03
 * @FilePath: robots.txt.js
 * @Description: 
 * Copyright 2023 OBKoro1, All Rights Reserved. 
 * 2023-07-23 22:18:28
 */

import fs from 'fs'
import BLOG from '@/blog.config'

export async function generateRobotsTxt() {
  const content = `
    # *
    User-agent: *
    Disallow: /
  
    # Host
    Host: ${BLOG.LINK}
  
    # Sitemaps
    Sitemap: ${BLOG.LINK}/sitemap.xml
  
    `
  try {
    fs.mkdirSync('./public', { recursive: true })
    fs.writeFileSync('./public/robots.txt', content)
  } catch (error) {
    // 在vercel运行环境是只读的，这里会报错；
    // 但在vercel编译阶段、或VPS等其他平台这行代码会成功执行
  }
}
