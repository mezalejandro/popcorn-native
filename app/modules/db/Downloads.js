import Base from './Base'

export default new (class DownloadsDB extends Base {

  KEY_DOWNLOADS = '@Popcorn:Downloads'

  downloads = []

  getAll = async() => {
    if (this.downloads.length > 0) {
      return this.downloads
    }

    const downloads = await this.getItem(this.KEY_DOWNLOADS)

    if (downloads) {
      this.downloads = JSON.parse(downloads)
      console.log('this.bookmarks', this.downloads)
      return this.downloads
    }

    return this.downloads
  }

  addItem = (item) => {
    this.downloads.push(item)

    this.setItem(this.KEY_DOWNLOADS, JSON.stringify(this.downloads))
  }

  removeItem = ({ id }) => {
    this.downloads = this.downloads.filter(download => download.id !== id)

    this.setItem(this.KEY_DOWNLOADS, JSON.stringify(this.downloads))
  }

  updateItem = ({ id, ...rest }) => {
    this.downloads = this.downloads.map((download) => {
      if (download.id !== id) {
        return download
      }

      return {
        ...download,
        ...rest
      }
    })

    this.setItem(this.KEY_DOWNLOADS, JSON.stringify(this.downloads))
  }

})()
