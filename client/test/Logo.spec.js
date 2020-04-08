import { mount } from '@vue/test-utils'
import BigHeartLogo from '@/components/BigHeartLogo.vue'

describe('BigHeartLogo', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(BigHeartLogo)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
