/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsService {
  private readonly API_URL = 'https://app.text.lk/api/v3/sms/send';
  private readonly API_KEY = process.env.TALK_LK_API_KEY; // Store your Bearer token here
  private readonly SENDER_ID = process.env.TALK_LK_SENDER_ID || 'TextLKDemo';

  async send(to: string, message: string) {
    const payload = {
      recipient: to,
      sender_id: this.SENDER_ID,
      type: 'plain',
      message: message,
    };

    const headers = {
      Authorization: `Bearer ${this.API_KEY}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(this.API_URL, payload, { headers });
      console.log('✅ SMS sent:', response.data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data;
    } catch (error: any) {
      console.error('❌ SMS send failed:', error.response?.data || error.message);
      throw error;
    }
  }
}
