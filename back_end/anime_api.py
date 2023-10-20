import anipy_cli

class API:
    def __init__(self):
        self.gogo_url = 'https://gogoanime.gg/'

    def getAnime(self, name):
        animes = []
        entry = anipy_cli.Entry()
        links_and_names = anipy_cli.query(name, entry).get_links()
        if links_and_names != 0:
            links = links_and_names[0]
            names = links_and_names[1]
            for i in range(len(links)):
                ani_name = names[i]
                ani_link = links[i][10:]
                # ani_info = anipy_cli.get_anime_info(self.gogo_url + ani_link)
                animes.append({
                    "name" : ani_name,
                    "link" : ani_link,
                })

        return animes

    def getAnimeInfo(self, link):
        print(link)
        entry = anipy_cli.Entry()
        entry.category_url = self.gogo_url + f'category/{link}'
        ep = anipy_cli.epHandler(entry)
        latest = ep.get_latest()
        data = anipy_cli.get_anime_info(self.gogo_url + 'category/' + link)
        data["latest_ep"] = latest
        return data

    def getAnimeVideoURL(self, link, ep_num):
        entry = anipy_cli.Entry()
        entry.category_url = self.gogo_url + f'category/{link}'
        ep = anipy_cli.epHandler(entry)
        ep.entry.ep = ep_num
        link = ep.gen_eplink()
        url_class = anipy_cli.videourl(link, "best")
        url_class.stream_url()
        return {"link" : url_class.entry.stream_url}

if __name__ == '__main__':
    from time import time
    t = time()
    API().getAnime('naruto')
    print(time() - t)
