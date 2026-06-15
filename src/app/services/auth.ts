import { Injectable } from '@angular/core';

import { createClient }
from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private supabase = createClient(

    'https://mwpdaktybatujiqclrru.supabase.co',

    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cGRha3R5YmF0dWppcWNscnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMDM5NzUsImV4cCI6MjA4NTU3OTk3NX0.UadlRjAL8W41Z5sHVQ1oqw9ZfJLoCRAZsYyP6buHsRw',

    {
      auth: {
        persistSession: false
      }
    }

  );

  // =========================
  // SIGNUP
  // =========================

  async signup(
    username: string,
    password: string,
    avatar: string
  ) {

    // CHECK EXISTING USERNAME

    const {
      data: existingUsers,
      error: checkError
    } = await this.supabase
      .from('players')
      .select('*')
      .eq('username', username);

    console.log(
      'Existing Users:',
      existingUsers
    );

    if (
      existingUsers &&
      existingUsers.length > 0
    ) {

      return {
        error: {
          message:
            'Username already exists'
        }
      };

    }

    // GET LAST PLAYER ID

    const { data: players } =

      await this.supabase
        .from('players')
        .select('player_id')
        .order('player_id', {
          ascending: false
        })
        .limit(1);

    let nextId = 'EA001';

    if (
      players &&
      players.length > 0
    ) {

      const lastPlayerId =
        players[0].player_id;

      const lastNumber =
        parseInt(
          lastPlayerId.replace(
            'EA',
            ''
          )
        );

      const newNumber =
        lastNumber + 1;

      nextId =
        'EA' +
        newNumber
          .toString()
          .padStart(3, '0');

    }

    // INSERT PLAYER

    const { data, error } =

      await this.supabase
        .from('players')
        .insert([
          {
            player_id: nextId,
            username,
            password,
            avatar
          }
        ])
        .select();

    return {
      data,
      error
    };

  }
// =========================
// LOGIN
// =========================

async login(
  username: string,
  password: string
) {

  const { data, error } =

    await this.supabase
      .from('players')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

  return {
    data,
    error
  };

}}